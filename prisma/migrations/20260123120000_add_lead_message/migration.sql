-- CreateEnum
CREATE TYPE "LeadMessageSenderType" AS ENUM ('CUSTOMER', 'DEALERSHIP');

-- CreateTable
CREATE TABLE "LeadMessage" (
    "id" TEXT NOT NULL,
    "leadId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "senderType" "LeadMessageSenderType" NOT NULL,
    "senderName" TEXT NOT NULL,
    "senderId" TEXT,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "emailSentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LeadMessage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LeadMessage_leadId_idx" ON "LeadMessage"("leadId");

-- CreateIndex
CREATE INDEX "LeadMessage_createdAt_idx" ON "LeadMessage"("createdAt");

-- AddForeignKey
ALTER TABLE "LeadMessage" ADD CONSTRAINT "LeadMessage_leadId_fkey" FOREIGN KEY ("leadId") REFERENCES "Lead"("id") ON DELETE CASCADE ON UPDATE CASCADE;
