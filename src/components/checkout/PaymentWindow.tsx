"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Clock, Loader2, UploadCloud } from "lucide-react";
import { PAYMENT_PROOF_MAX_BYTES, PAYMENT_PROOF_TYPES, PAYMENT_WINDOW_MINUTES } from "@/lib/payments";

/**
 * The 20-minute payment window and the screenshot the customer sends back.
 *
 * The countdown is a prompt to pay now, not a deadline that voids anything:
 * when it runs out the order is still live and the upload still works, it just
 * says so plainly. Nothing here is required to complete an order — the transfer
 * itself is what pays for it — but a screenshot lets the owner match an unclear
 * payment without emailing the customer.
 */
export function PaymentWindow({
  orderNumber,
  accessKey,
  placedAt,
  existingProofUrl,
  uploadsEnabled,
}: {
  orderNumber: string;
  accessKey: string;
  /** ISO string; the deadline is this plus the payment window. */
  placedAt: string;
  existingProofUrl: string | null;
  uploadsEnabled: boolean;
}) {
  const deadline = new Date(placedAt).getTime() + PAYMENT_WINDOW_MINUTES * 60_000;
  const [remaining, setRemaining] = useState(() => deadline - Date.now());

  useEffect(() => {
    const tick = () => setRemaining(deadline - Date.now());
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [deadline]);

  const expired = remaining <= 0;
  const totalSeconds = Math.max(0, Math.floor(remaining / 1000));
  const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
  const seconds = String(totalSeconds % 60).padStart(2, "0");
  const urgent = !expired && remaining < 5 * 60_000;

  return (
    <>
      <div
        className={`mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border px-4 py-3.5 ${
          expired
            ? "border-line bg-mist"
            : urgent
              ? "border-red-200 bg-red-50"
              : "border-amber-200 bg-amber-50"
        }`}
      >
        <span className="flex items-center gap-2.5">
          <Clock
            size={18}
            className={expired ? "text-ink-500" : urgent ? "text-red-600" : "text-amber-600"}
          />
          <span className="text-[13px] font-semibold text-ink-800">
            {expired ? "Payment window elapsed" : "Please transfer within"}
          </span>
        </span>
        {expired ? (
          <span className="text-[12.5px] text-ink-600">
            Your order is still reserved — you can pay and upload below.
          </span>
        ) : (
          <span
            className={`font-display text-2xl font-bold tabular-nums ${
              urgent ? "text-red-700" : "text-amber-700"
            }`}
            aria-live="off"
          >
            {minutes}:{seconds}
          </span>
        )}
      </div>

      <ProofUpload
        orderNumber={orderNumber}
        accessKey={accessKey}
        existingProofUrl={existingProofUrl}
        uploadsEnabled={uploadsEnabled}
      />
    </>
  );
}

function ProofUpload({
  orderNumber,
  accessKey,
  existingProofUrl,
  uploadsEnabled,
}: {
  orderNumber: string;
  accessKey: string;
  existingProofUrl: string | null;
  uploadsEnabled: boolean;
}) {
  const [proofUrl, setProofUrl] = useState(existingProofUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function upload(file: File) {
    setError(null);

    // Checked here as well as on the server so an obvious mistake — a PDF
    // statement, a photo of a vial — is caught before the round trip.
    if (!PAYMENT_PROOF_TYPES.includes(file.type)) {
      setError("That is not a screenshot. Upload an image of your payment — JPEG, PNG, WebP or HEIC.");
      return;
    }
    if (file.size > PAYMENT_PROOF_MAX_BYTES) {
      setError("Screenshots must be 8 MB or smaller.");
      return;
    }

    const body = new FormData();
    body.set("number", orderNumber);
    body.set("key", accessKey);
    body.set("file", file);

    setBusy(true);
    try {
      const res = await fetch("/api/orders/payment-proof", { method: "POST", body });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) {
        setError(data.error ?? "Upload failed. Please try again.");
        return;
      }
      setProofUrl(data.url);
    } catch {
      setError("Upload failed. Please check your connection and try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  if (!uploadsEnabled) return null;

  return (
    <div className="mt-4 rounded-xl border border-line bg-white p-4">
      <p className="text-[13px] font-semibold text-ink-900">
        Upload your payment screenshot{" "}
        <span className="font-normal text-ink-500">(optional)</span>
      </p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600">
        A screenshot of the payment itself — the confirmation from your banking app showing the
        amount and reference. It helps us match your transfer straight away. Please don&apos;t upload
        anything else.
      </p>

      {proofUrl ? (
        <div className="mt-3 flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          {/* An arbitrary blob URL preview; next/image would add nothing here. */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={proofUrl}
            alt="Your payment screenshot"
            className="h-16 w-16 shrink-0 rounded-lg bg-white object-cover"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-800">
              <Check size={15} /> Screenshot received
            </span>
            <span className="mt-0.5 block text-[12px] text-emerald-900/70">
              We&apos;ll confirm once the funds clear.
            </span>
          </span>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={busy}
            className="shrink-0 rounded-full border border-emerald-300 px-3.5 py-1.5 text-[12.5px] font-semibold text-emerald-800 transition hover:bg-white disabled:opacity-50"
          >
            {busy ? "Replacing…" : "Replace"}
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className="mt-3 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-line px-4 py-7 text-center transition hover:border-brand-400 hover:bg-mist disabled:opacity-60"
        >
          {busy ? (
            <Loader2 size={22} className="animate-spin text-brand-600" />
          ) : (
            <UploadCloud size={22} className="text-brand-600" />
          )}
          <span className="text-[13px] font-semibold text-ink-800">
            {busy ? "Uploading…" : "Choose a screenshot"}
          </span>
          <span className="text-[11.5px] text-ink-500">JPEG, PNG, WebP or HEIC · up to 8 MB</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={PAYMENT_PROOF_TYPES.join(",")}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void upload(file);
        }}
      />

      {error && (
        <p
          role="alert"
          className="mt-2.5 flex items-start gap-1.5 text-[12.5px] font-medium text-red-700"
        >
          <AlertCircle size={14} className="mt-px shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
