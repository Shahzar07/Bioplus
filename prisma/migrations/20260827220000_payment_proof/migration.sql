-- Proof of payment uploaded by the customer on the order's payment page.
-- Written to be safe to re-apply.

-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProofUrl" TEXT;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProofUploadedAt" TIMESTAMP(3);
