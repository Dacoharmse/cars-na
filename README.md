# Cars.na - Car Dealership Marketplace Platform

## Overview

Cars.na is a full-stack web application that serves as a marketplace and directory for car dealerships and private sellers. The platform enables dealerships to list, manage, and showcase their inventory to potential buyers, while also providing a "Sell Your Car" flow for private owners to submit vehicles for dealerships to purchase.

## Key Features

### Public Site
- SEO-friendly pages for browsing and searching vehicles
- Advanced filtering by make, model, year, price, and mileage
- Detailed vehicle pages with image carousel and specifications
- Prominent "Contact Seller" call-to-action

### Dealer Dashboard
- Inventory management (create, update, delete car listings)
- Private submission management ("Personal Cars for Sale")
- Lead tracking and analytics
- Dealership settings and profile management

### Admin Dashboard
- Global site settings and configuration
- User and dealership management
- Content moderation
- System health monitoring

### Sell Your Car Wizard
- Multi-step form for private vehicle submissions
- Photo upload capabilities
- Email confirmation to sellers
- Submissions visible to dealerships

## User Personas

- **Site Admin**: Global platform operator
- **Dealership Principal**: Dealership account owner
- **Sales Executive**: Team member who creates & edits listings
- **Individual Seller**: No login; uses "Sell Your Car" wizard

## Tech Stack

- **Frontend**: Next.js App Router with React & TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components + lucide-react icons
- **API Layer**: tRPC with superjson transformer
- **Authentication**: NextAuth.js with Prisma adapter
- **Database**: PostgreSQL accessed via Prisma ORM
- **State & Data Fetching**: @tanstack/react-query + Zustand
- **Forms & Validation**: React Hook Form + Zod schemas
- **Charts & Analytics**: Recharts components
- **Testing**: Cypress with wick-a11y for accessibility testing

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cars-na.git
   cd cars-na
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Set up environment variables
   ```bash
   # Create a .env file with the following variables
   DATABASE_URL="postgresql://username:password@localhost:5432/cars_na"
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. Initialize the database
   ```bash
   npm run db:push
   ```

5. Run the development server
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) with your browser

## Project Structure

```
├── cypress/               # Cypress tests including accessibility tests
├── prisma/               # Prisma schema and migrations
├── public/               # Static assets
└── src/
    ├── app/              # Next.js App Router pages
    │   ├── admin/        # Admin dashboard routes
    │   ├── api/          # API routes
    │   ├── dashboard/    # Dealer dashboard routes
    │   ├── login/        # Authentication routes
    │   ├── sell/         # Sell Your Car wizard
    │   └── vehicles/     # Public vehicle listings
    ├── components/       # Reusable UI components
    │   ├── admin/        # Admin-specific components
    │   ├── dashboard/    # Dashboard-specific components
    │   ├── forms/        # Form components
    │   ├── layouts/      # Layout components
    │   └── ui/           # UI components (shadcn/ui)
    ├── lib/              # Utility functions and shared code
    │   ├── auth.ts       # NextAuth.js configuration
    │   └── prisma.ts     # Prisma client
    └── server/           # Server-side code
        ├── routers/      # tRPC routers
        └── trpc.ts       # tRPC configuration
```

## Accessibility

This project follows WCAG accessibility guidelines and uses Cypress with the wick-a11y package for accessibility testing. Key focus areas include:

- Keyboard navigation
- ARIA attributes
- Color contrast
- Screen reader compatibility
- Focus management

## Deployment

The application is designed to be deployed on Vercel or any other hosting platform that supports Next.js applications.

## License

MIT
