/**
 * User router for Cars.na
 */
import { z } from "zod";
import { router, publicProcedure, protectedProcedure, adminProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import bcrypt from "bcrypt";

export const userRouter = router({
  // Get the current logged in user
  me: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.prisma.user.findUnique({
      where: { id: ctx.session.user.id },
      include: {
        dealership: true,
      },
    });

    if (!user) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: "User not found",
      });
    }

    return user;
  }),

  // Get all users with pagination, filtering, and sorting (admin only)
  getAll: adminProcedure
    .input(
      z.object({
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(10),
        search: z.string().optional(),
        role: z.enum(["ADMIN", "DEALER_PRINCIPAL", "SALES_EXECUTIVE", "USER"]).optional(),
        status: z.enum(["ACTIVE", "PENDING", "SUSPENDED", "INACTIVE"]).optional(),
        sortBy: z.enum(["name", "email", "createdAt", "lastLoginAt", "loginCount"]).default("createdAt"),
        sortOrder: z.enum(["asc", "desc"]).default("desc"),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, limit, search, role, status, sortBy, sortOrder } = input;
      const skip = (page - 1) * limit;

      // Build where clause
      const where: any = {};

      if (search) {
        where.OR = [
          { name: { contains: search, mode: "insensitive" } },
          { email: { contains: search, mode: "insensitive" } },
        ];
      }

      if (role) {
        where.role = role;
      }

      if (status) {
        where.status = status;
      }

      // Get total count for pagination
      const total = await ctx.prisma.user.count({ where });

      // Get users with pagination
      const users = await ctx.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          dealership: true,
          auditLogs: {
            take: 5,
            orderBy: { createdAt: "desc" },
          },
        },
      });

      return {
        users,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Get user statistics (admin only)
  getStats: adminProcedure.query(async ({ ctx }) => {
    const [
      totalUsers,
      activeUsers,
      suspendedUsers,
      pendingUsers,
      adminUsers,
      dealerUsers,
      regularUsers,
      recentLogins,
    ] = await Promise.all([
      ctx.prisma.user.count(),
      ctx.prisma.user.count({ where: { status: "ACTIVE" } }),
      ctx.prisma.user.count({ where: { status: "SUSPENDED" } }),
      ctx.prisma.user.count({ where: { status: "PENDING" } }),
      ctx.prisma.user.count({ where: { role: "ADMIN" } }),
      ctx.prisma.user.count({
        where: {
          OR: [
            { role: "DEALER_PRINCIPAL" },
            { role: "SALES_EXECUTIVE" }
          ]
        }
      }),
      ctx.prisma.user.count({ where: { role: "USER" } }),
      ctx.prisma.user.count({
        where: {
          lastLoginAt: {
            gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Last 24 hours
          },
        },
      }),
    ]);

    // Get user growth data for the last 12 months
    const monthlyGrowth = await ctx.prisma.user.groupBy({
      by: ["createdAt"],
      _count: true,
      where: {
        createdAt: {
          gte: new Date(new Date().setMonth(new Date().getMonth() - 12)),
        },
      },
    });

    return {
      totalUsers,
      activeUsers,
      suspendedUsers,
      pendingUsers,
      usersByRole: {
        admin: adminUsers,
        dealer: dealerUsers,
        regular: regularUsers,
      },
      recentLogins,
      monthlyGrowth,
    };
  }),

  // Get user by ID (admin only)
  getById: adminProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
        include: {
          dealership: true,
        },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return user;
    }),

  // Create user (admin only)
  create: adminProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        password: z.string().min(8),
        role: z.enum(["ADMIN", "DEALER_PRINCIPAL", "SALES_EXECUTIVE", "USER"]),
        dealershipId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if email is already in use
      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (existingUser) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Email already in use",
        });
      }

      // Hash the password before storing
      const hashedPassword = await bcrypt.hash(input.password, 12);
      
      return await ctx.prisma.user.create({
        data: {
          name: input.name,
          email: input.email,
          password: hashedPassword,
          role: input.role,
          dealershipId: input.dealershipId,
        },
      });
    }),

  // Update user (admin only)
  update: adminProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().optional(),
        email: z.string().email().optional(),
        role: z.enum(["ADMIN", "DEALER_PRINCIPAL", "SALES_EXECUTIVE", "USER"]).optional(),
        status: z.enum(["ACTIVE", "PENDING", "SUSPENDED", "INACTIVE"]).optional(),
        dealershipId: z.string().optional().nullable(),
        phone: z.string().optional(),
        address: z.string().optional(),
        city: z.string().optional(),
        region: z.string().optional(),
        postalCode: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Check if user exists
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Check if email is already in use by another user
      if (input.email) {
        const existingUser = await ctx.prisma.user.findUnique({
          where: { email: input.email },
        });

        if (existingUser && existingUser.id !== input.id) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email already in use",
          });
        }
      }

      // Track role changes for audit
      const roleChanged = input.role && input.role !== user.role;

      const updatedUser = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          name: input.name,
          email: input.email,
          role: input.role,
          status: input.status,
          dealershipId: input.dealershipId,
          phone: input.phone,
          address: input.address,
          city: input.city,
          region: input.region,
          postalCode: input.postalCode,
        },
      });

      // Create audit log entry
      await ctx.prisma.userAuditLog.create({
        data: {
          userId: input.id,
          action: roleChanged ? "ROLE_CHANGED" : "UPDATED",
          details: roleChanged
            ? `Role changed from ${user.role} to ${input.role}`
            : `User profile updated`,
          performedBy: ctx.session.user.id,
          ipAddress: ctx.req.headers["x-forwarded-for"] as string || ctx.req.socket.remoteAddress,
          userAgent: ctx.req.headers["user-agent"],
        },
      });

      return updatedUser;
    }),

  // Suspend user (admin only)
  suspend: adminProcedure
    .input(
      z.object({
        id: z.string(),
        reason: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      if (user.role === "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot suspend admin users",
        });
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          status: "SUSPENDED",
          isSuspended: true,
          suspendReason: input.reason,
          suspendedAt: new Date(),
          suspendedBy: ctx.session.user.id,
        },
      });

      // Create audit log entry
      await ctx.prisma.userAuditLog.create({
        data: {
          userId: input.id,
          action: "SUSPENDED",
          details: `User suspended: ${input.reason}`,
          performedBy: ctx.session.user.id,
          ipAddress: ctx.req.headers["x-forwarded-for"] as string || ctx.req.socket.remoteAddress,
          userAgent: ctx.req.headers["user-agent"],
        },
      });

      return updatedUser;
    }),

  // Activate user (admin only)
  activate: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const updatedUser = await ctx.prisma.user.update({
        where: { id: input.id },
        data: {
          status: "ACTIVE",
          isSuspended: false,
          suspendReason: null,
          suspendedAt: null,
          suspendedBy: null,
        },
      });

      // Create audit log entry
      await ctx.prisma.userAuditLog.create({
        data: {
          userId: input.id,
          action: "ACTIVATED",
          details: "User activated",
          performedBy: ctx.session.user.id,
          ipAddress: ctx.req.headers["x-forwarded-for"] as string || ctx.req.socket.remoteAddress,
          userAgent: ctx.req.headers["user-agent"],
        },
      });

      return updatedUser;
    }),

  // Bulk actions (admin only)
  bulkAction: adminProcedure
    .input(
      z.object({
        userIds: z.array(z.string()),
        action: z.enum(["suspend", "activate", "delete"]),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { userIds, action, reason } = input;

      // Prevent admin users from being bulk actioned
      const adminUsers = await ctx.prisma.user.findMany({
        where: {
          id: { in: userIds },
          role: "ADMIN",
        },
      });

      if (adminUsers.length > 0) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Cannot perform bulk actions on admin users",
        });
      }

      let updateData: any = {};
      let auditAction: any = "";

      switch (action) {
        case "suspend":
          updateData = {
            status: "SUSPENDED",
            isSuspended: true,
            suspendReason: reason,
            suspendedAt: new Date(),
            suspendedBy: ctx.session.user.id,
          };
          auditAction = "SUSPENDED";
          break;
        case "activate":
          updateData = {
            status: "ACTIVE",
            isSuspended: false,
            suspendReason: null,
            suspendedAt: null,
            suspendedBy: null,
          };
          auditAction = "ACTIVATED";
          break;
        case "delete":
          // For delete, we'll handle it separately
          await ctx.prisma.user.deleteMany({
            where: { id: { in: userIds } },
          });

          // Create audit logs for deleted users
          await ctx.prisma.userAuditLog.createMany({
            data: userIds.map(userId => ({
              userId,
              action: "DELETED" as any,
              details: reason || "User deleted via bulk action",
              performedBy: ctx.session.user.id,
              ipAddress: ctx.req.headers["x-forwarded-for"] as string || ctx.req.socket.remoteAddress,
              userAgent: ctx.req.headers["user-agent"],
            })),
          });

          return { success: true, count: userIds.length };
      }

      // Update users
      await ctx.prisma.user.updateMany({
        where: { id: { in: userIds } },
        data: updateData,
      });

      // Create audit logs
      await ctx.prisma.userAuditLog.createMany({
        data: userIds.map(userId => ({
          userId,
          action: auditAction,
          details: reason || `Bulk ${action} action`,
          performedBy: ctx.session.user.id,
          ipAddress: ctx.req.headers["x-forwarded-for"] as string || ctx.req.socket.remoteAddress,
          userAgent: ctx.req.headers["user-agent"],
        })),
      });

      return { success: true, count: userIds.length };
    }),

  // Get user audit logs (admin only)
  getAuditLogs: adminProcedure
    .input(
      z.object({
        userId: z.string().optional(),
        page: z.number().min(1).default(1),
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }) => {
      const { userId, page, limit } = input;
      const skip = (page - 1) * limit;

      const where = userId ? { userId } : {};

      const [logs, total] = await Promise.all([
        ctx.prisma.userAuditLog.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: "desc" },
          include: {
            user: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        }),
        ctx.prisma.userAuditLog.count({ where }),
      ]);

      return {
        logs,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      };
    }),

  // Reset user password (admin only)
  resetPassword: adminProcedure
    .input(
      z.object({
        id: z.string(),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      const hashedPassword = await bcrypt.hash(input.newPassword, 12);

      await ctx.prisma.user.update({
        where: { id: input.id },
        data: { password: hashedPassword },
      });

      // Create audit log entry
      await ctx.prisma.userAuditLog.create({
        data: {
          userId: input.id,
          action: "PASSWORD_RESET",
          details: "Password reset by admin",
          performedBy: ctx.session.user.id,
          ipAddress: ctx.req.headers["x-forwarded-for"] as string || ctx.req.socket.remoteAddress,
          userAgent: ctx.req.headers["user-agent"],
        },
      });

      return { success: true };
    }),

  // Change password (protected)
  changePassword: protectedProcedure
    .input(
      z.object({
        currentPassword: z.string(),
        newPassword: z.string().min(8),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Get current user
      const user = await ctx.prisma.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      // Verify current password
      const passwordMatch = await bcrypt.compare(
        input.currentPassword,
        user.password
      );

      if (!passwordMatch) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Current password is incorrect",
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(input.newPassword, 12);

      // Update password
      await ctx.prisma.user.update({
        where: { id: ctx.session.user.id },
        data: {
          password: hashedPassword,
        },
      });

      return { success: true };
    }),

  // Delete user (admin only)
  delete: adminProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      // Check if user exists
      const user = await ctx.prisma.user.findUnique({
        where: { id: input.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User not found",
        });
      }

      return await ctx.prisma.user.delete({
        where: { id: input.id },
      });
    }),
});
