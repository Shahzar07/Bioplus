-- Puts the store's real bank-transfer details in place for an install seeded
-- before they were known, so orders are issued an account to pay into rather
-- than a promise to email one.
--
-- Only rows still holding the placeholder are touched: an owner who has
-- already entered an account number in Settings → Bank transfer keeps it, and
-- re-running this is a no-op.
UPDATE "Setting"
SET
  "value" = "value" || jsonb_build_object(
    'accountName', 'Alessandro Iannelli',
    'bankName', 'Tide Business',
    'sortCode', '04-06-05',
    'accountNumber', '32437300',
    'iban', '',
    'bic', ''
  ),
  "updatedAt" = now()
WHERE "key" = 'bankTransfer'
  AND COALESCE("value" ->> 'accountNumber', '') = '';
