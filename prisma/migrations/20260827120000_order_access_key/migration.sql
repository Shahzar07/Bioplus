-- Adds the per-order access key that lets a guest reach their bank-transfer
-- payment page. Existing orders are backfilled with a random key so the column
-- can be made NOT NULL without losing history.

-- AlterTable
ALTER TABLE "Order" ADD COLUMN "accessKey" TEXT;

-- Backfill
UPDATE "Order"
SET "accessKey" = md5(random()::text || clock_timestamp()::text || "id")
WHERE "accessKey" IS NULL;

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "accessKey" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Order_accessKey_key" ON "Order"("accessKey");
