"use client";

import { useEffect, useRef, useState } from "react";
import { AlertCircle, Check, Loader2, UploadCloud } from "lucide-react";
import {
  PAYMENT_PROOF_MAX_BYTES,
  PAYMENT_PROOF_TYPES,
  PAYMENT_WINDOW_MINUTES,
} from "@/lib/payments";

/**
 * The payment window and the screenshot the customer sends back.
 *
 * The countdown is a real clock face, not a line of copy: a ring that empties
 * as the time goes, so a glance is enough. It is still a prompt rather than an
 * expiry — nothing cancels the order or releases its stock when it runs out,
 * because a bank transfer can legitimately take longer and losing a paid order
 * would be far worse than a late one.
 */
export function PaymentWindow({
  orderNumber,
  accessKey,
  placedAt,
  hasProof,
}: {
  orderNumber: string;
  accessKey: string;
  /** ISO string; the deadline is this plus the payment window. */
  placedAt: string;
  hasProof: boolean;
}) {
  return (
    <>
      <CountdownRing placedAt={placedAt} />
      <ProofUpload orderNumber={orderNumber} accessKey={accessKey} hasProof={hasProof} />
    </>
  );
}

const RING_SIZE = 132;
const RING_STROKE = 9;
const RADIUS = (RING_SIZE - RING_STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

function CountdownRing({ placedAt }: { placedAt: string }) {
  const total = PAYMENT_WINDOW_MINUTES * 60_000;
  const deadline = new Date(placedAt).getTime() + total;

  // Rendered from the server's placedAt on the first paint, then ticked in the
  // browser — no flash of a wrong time on hydration.
  const [remaining, setRemaining] = useState(() => Math.max(0, deadline - Date.now()));

  useEffect(() => {
    const tick = () => setRemaining(Math.max(0, deadline - Date.now()));
    tick();
    const id = window.setInterval(tick, 250);
    return () => window.clearInterval(id);
  }, [deadline]);

  const expired = remaining <= 0;
  const seconds = Math.ceil(remaining / 1000);
  const mm = String(Math.floor(seconds / 60)).padStart(2, "0");
  const ss = String(seconds % 60).padStart(2, "0");

  const fraction = expired ? 0 : remaining / total;
  const urgent = !expired && remaining <= 5 * 60_000;
  const colour = expired ? "#8b8f98" : urgent ? "#dc2626" : "#f85000";

  return (
    <div
      className={`mt-5 flex flex-col items-center gap-4 rounded-2xl border px-5 py-6 sm:flex-row sm:gap-6 ${
        expired ? "border-line bg-mist" : urgent ? "border-red-200 bg-red-50/60" : "border-brand-200 bg-brand-50/40"
      }`}
    >
      <div className="relative shrink-0" style={{ width: RING_SIZE, height: RING_SIZE }}>
        <svg
          width={RING_SIZE}
          height={RING_SIZE}
          // Start the ring at twelve o'clock and empty it clockwise.
          className="-rotate-90"
          role="img"
          aria-label={expired ? "Payment window elapsed" : `${mm} minutes ${ss} seconds remaining`}
        >
          <circle
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke="currentColor"
            strokeWidth={RING_STROKE}
            className="text-ink-900/10"
          />
          <circle
            data-countdown-ring=""
            cx={RING_SIZE / 2}
            cy={RING_SIZE / 2}
            r={RADIUS}
            fill="none"
            stroke={colour}
            strokeWidth={RING_STROKE}
            strokeLinecap="round"
            strokeDasharray={CIRCUMFERENCE}
            strokeDashoffset={CIRCUMFERENCE * (1 - fraction)}
            style={{ transition: "stroke-dashoffset 250ms linear, stroke 400ms ease" }}
          />
        </svg>
        <span className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            data-countdown-clock=""
            className="font-display text-[30px] font-extrabold leading-none tabular-nums"
            style={{ color: colour }}
          >
            {mm}:{ss}
          </span>
          <span className="mt-1 text-[10.5px] font-bold uppercase tracking-widest text-ink-500">
            {expired ? "elapsed" : "remaining"}
          </span>
        </span>
      </div>

      <div className="text-center sm:text-left">
        <p className="font-display text-lg font-bold text-ink-900">
          {expired ? "Payment window elapsed" : `Please transfer within ${PAYMENT_WINDOW_MINUTES} minutes`}
        </p>
        <p className="mt-1.5 text-[13px] leading-relaxed text-ink-600">
          {expired ? (
            <>
              Your order is still reserved and the account details below still apply — please go ahead
              and pay. If you have already paid, ignore this and we&apos;ll confirm once it clears.
            </>
          ) : (
            <>
              Paying inside this window means we can dispatch today. The order is not cancelled if the
              timer runs out — it just may not go out until the next working day.
            </>
          )}
        </p>
      </div>
    </div>
  );
}

/**
 * Screenshots are downscaled in the browser before they are sent, so a 6 MB
 * phone screenshot becomes a couple of hundred kilobytes. That is what makes
 * keeping them in the database reasonable, and it means an upload does not fail
 * on a slow connection or a large photo.
 */
async function downscale(file: File): Promise<File> {
  const MAX_EDGE = 1600;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    // Already small enough, and a format we can store as-is.
    if (scale === 1 && file.size <= 900_000) return file;

    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg", 0.85),
    );
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], "payment-screenshot.jpg", { type: "image/jpeg" });
  } catch {
    // HEIC on a browser that cannot decode it, or a canvas failure — send the
    // original and let the server's size limit have the last word.
    return file;
  }
}

function ProofUpload({
  orderNumber,
  accessKey,
  hasProof,
}: {
  orderNumber: string;
  accessKey: string;
  hasProof: boolean;
}) {
  const [uploaded, setUploaded] = useState(hasProof);
  /**
   * Bumped after each upload to bust the browser cache on the thumbnail.
   * The preview reads the stored image back rather than showing a local
   * object URL: one source of truth, and the customer sees what we actually
   * hold. (An object URL is not an option anyway — it dies when the file
   * input is cleared below.)
   */
  const [version, setVersion] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const storedUrl = `/api/orders/payment-proof?number=${encodeURIComponent(
    orderNumber,
  )}&key=${encodeURIComponent(accessKey)}`;

  async function upload(file: File) {
    setError(null);

    // Caught here as well as on the server so an obvious mistake — a PDF
    // statement, a photo of something else — costs no round trip.
    if (!PAYMENT_PROOF_TYPES.includes(file.type)) {
      setError("That is not a screenshot. Upload an image of your payment — JPEG, PNG, WebP or HEIC.");
      return;
    }

    setBusy(true);
    try {
      const prepared = await downscale(file);
      if (prepared.size > PAYMENT_PROOF_MAX_BYTES) {
        setError("That image is too large. Try cropping it to just the payment confirmation.");
        return;
      }

      const body = new FormData();
      body.set("number", orderNumber);
      body.set("key", accessKey);
      body.set("file", prepared);

      const res = await fetch("/api/orders/payment-proof", { method: "POST", body });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (!res.ok) {
        setError(data.error ?? "Upload failed. Please try again.");
        return;
      }

      setVersion((n) => n + 1);
      setUploaded(true);
    } catch {
      setError("Upload failed. Please check your connection and try again.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="mt-4 rounded-2xl border border-line bg-white p-5">
      <p className="font-display text-[15px] font-bold text-ink-900">
        Upload your payment screenshot{" "}
        <span className="text-[13px] font-normal text-ink-500">(optional)</span>
      </p>
      <p className="mt-1 text-[12.5px] leading-relaxed text-ink-600">
        A screenshot of the payment itself — the confirmation from your banking app showing the amount
        and the reference. It lets us match your transfer straight away. Please don&apos;t upload
        anything else.
      </p>

      {uploaded ? (
        <div className="mt-3.5 flex items-center gap-3.5 rounded-xl border border-emerald-200 bg-emerald-50 p-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={version > 0 ? `${storedUrl}&v=${version}` : storedUrl}
            alt="Your payment screenshot"
            className="h-20 w-20 shrink-0 rounded-lg bg-white object-cover"
          />
          <span className="min-w-0 flex-1">
            <span className="flex items-center gap-1.5 text-[13.5px] font-bold text-emerald-800">
              <Check size={16} /> Screenshot received
            </span>
            <span className="mt-0.5 block text-[12px] leading-relaxed text-emerald-900/70">
              We&apos;ll confirm your order once the funds clear.
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
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) void upload(file);
          }}
          className={`mt-3.5 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-8 text-center transition disabled:opacity-60 ${
            dragging ? "border-brand-500 bg-brand-50" : "border-line hover:border-brand-400 hover:bg-mist"
          }`}
        >
          {busy ? (
            <Loader2 size={24} className="animate-spin text-brand-600" />
          ) : (
            <UploadCloud size={24} className="text-brand-600" />
          )}
          <span className="text-[13.5px] font-bold text-ink-800">
            {busy ? "Uploading…" : "Choose a screenshot"}
          </span>
          <span className="text-[11.5px] text-ink-500">
            or drag one here · JPEG, PNG, WebP or HEIC
          </span>
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
