-- Add invoice system: InvoiceStatus enum, Invoice table,
-- accessRestrictedAt on Dealership, and new NotificationType values

-- CreateEnum
CREATE TYPE "InvoiceStatus" AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');

-- AlterEnum: add new values to NotificationType
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'INVOICE_GENERATED';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'INVOICE_OVERDUE';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'INVOICE_PAID';
ALTER TYPE "NotificationType" ADD VALUE IF NOT EXISTS 'ACCESS_RESTRICTED';

-- AlterTable: add accessRestrictedAt to Dealership
ALTER TABLE "Dealership" ADD COLUMN IF NOT EXISTS "accessRestrictedAt" TIMESTAMP(3);

-- CreateTable: Invoice
CREATE TABLE IF NOT EXISTS "Invoice" (
    "id" TEXT NOT NULL,
    "invoiceNumber" TEXT NOT NULL,
    "dealershipId" TEXT NOT NULL,
    "billingMonth" INTEGER NOT NULL,
    "billingYear" INTEGER NOT NULL,
    "subscriptionAmount" DOUBLE PRECISION NOT NULL,
    "stockValue" DOUBLE PRECISION NOT NULL,
    "stockFeeAmount" DOUBLE PRECISION NOT NULL,
    "totalAmount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'NAD',
    "planName" TEXT NOT NULL,
    "vehicleCount" INTEGER NOT NULL,
    "status" "InvoiceStatus" NOT NULL DEFAULT 'PENDING',
    "dueDate" TIMESTAMP(3) NOT NULL,
    "paidAt" TIMESTAMP(3),
    "paidById" TEXT,
    "pdfPath" TEXT,
    "sentAt" TIMESTAMP(3),
    "lastReminderAt" TIMESTAMP(3),
    "reminderCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Invoice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_invoiceNumber_key" ON "Invoice"("invoiceNumber");
CREATE UNIQUE INDEX IF NOT EXISTS "Invoice_dealershipId_billingMonth_billingYear_key" ON "Invoice"("dealershipId", "billingMonth", "billingYear");
CREATE INDEX IF NOT EXISTS "Invoice_dealershipId_idx" ON "Invoice"("dealershipId");
CREATE INDEX IF NOT EXISTS "Invoice_status_idx" ON "Invoice"("status");
CREATE INDEX IF NOT EXISTS "Invoice_dueDate_idx" ON "Invoice"("dueDate");

-- AddForeignKey
ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_dealershipId_fkey"
    FOREIGN KEY ("dealershipId") REFERENCES "Dealership"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Invoice" ADD CONSTRAINT "Invoice_paidById_fkey"
    FOREIGN KEY ("paidById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
