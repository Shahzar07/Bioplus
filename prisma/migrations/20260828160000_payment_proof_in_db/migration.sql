-- Payment screenshots move from object storage into the database, so the
-- upload works without BLOB_READ_WRITE_TOKEN being configured. The browser
-- downscales before sending, so rows stay small.
-- Safe to re-apply.

-- AlterTable
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProofData" BYTEA;
ALTER TABLE "Order" ADD COLUMN IF NOT EXISTS "paymentProofType" TEXT;

-- The blob URL column is no longer written to; dropped rather than left to rot.
ALTER TABLE "Order" DROP COLUMN IF EXISTS "paymentProofUrl";
