"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ShoppingCart, X, Volume2, VolumeX } from "lucide-react";
import { formatGBP } from "@/lib/cn";

/**
 * Live order notifications.
 *
 * Polls the feed every 3 seconds while the tab is visible and every 30 when it
 * is not, so a dashboard left open in a background tab costs almost nothing.
 * New orders raise a toast, a chime and a refresh of the current view.
 */

type FeedOrder = {
  id: string;
  number: string;
  total: number;
  customer: string;
  placedAt: string;
};

const ACTIVE_MS = 3_000;
const HIDDEN_MS = 30_000;
const SOUND_KEY = "bioplus-admin-chime";

export function OrderAlerts({ initialLatestOrderId }: { initialLatestOrderId: string | null }) {
  const router = useRouter();
  const [toasts, setToasts] = useState<FeedOrder[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const latestId = useRef(initialLatestOrderId);
  const audioCtx = useRef<AudioContext | null>(null);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(SOUND_KEY);
      if (stored === "off") setSoundOn(false);
    } catch {
      /* storage unavailable — keep the default */
    }
  }, []);

  const chime = useCallback(() => {
    if (!soundOn) return;
    try {
      audioCtx.current ??= new AudioContext();
      const ctx = audioCtx.current;
      // A short two-note rise — audible without being alarming.
      [880, 1320].forEach((frequency, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.value = frequency;
        gain.gain.setValueAtTime(0.0001, ctx.currentTime + index * 0.12);
        gain.gain.exponentialRampToValueAtTime(0.16, ctx.currentTime + index * 0.12 + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + index * 0.12 + 0.22);
        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime + index * 0.12);
        osc.stop(ctx.currentTime + index * 0.12 + 0.24);
      });
    } catch {
      /* autoplay blocked until the page is interacted with — silent is fine */
    }
  }, [soundOn]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    let stopped = false;

    async function poll() {
      try {
        const query = latestId.current ? `?after=${encodeURIComponent(latestId.current)}` : "";
        const res = await fetch(`/api/admin/orders/feed${query}`, { cache: "no-store" });
        if (res.ok) {
          const data = (await res.json()) as { latestOrderId: string | null; orders: FeedOrder[] };
          if (data.orders.length > 0) {
            setToasts((current) => [...data.orders, ...current].slice(0, 4));
            chime();
            // Pull the current view forward so tables and counts update too.
            router.refresh();
          }
          latestId.current = data.latestOrderId ?? latestId.current;
        }
      } catch {
        /* offline or a redeploy in flight — the next tick retries */
      }
      if (!stopped) {
        timer = setTimeout(poll, document.hidden ? HIDDEN_MS : ACTIVE_MS);
      }
    }

    timer = setTimeout(poll, ACTIVE_MS);
    const onVisibility = () => {
      if (!document.hidden) {
        clearTimeout(timer);
        timer = setTimeout(poll, 250);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      stopped = true;
      clearTimeout(timer);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [chime, router]);

  function toggleSound() {
    setSoundOn((on) => {
      const next = !on;
      try {
        window.localStorage.setItem(SOUND_KEY, next ? "on" : "off");
      } catch {
        /* ignore */
      }
      return next;
    });
  }

  return (
    <div className="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(92vw,340px)] flex-col gap-2">
      {toasts.map((order) => (
        <div
          key={order.id}
          className="pointer-events-auto overflow-hidden rounded-2xl border border-line bg-white shadow-pop"
        >
          <div className="flex items-start gap-3 p-4">
            <span className="brand-gradient grid h-9 w-9 shrink-0 place-items-center rounded-xl text-white">
              <ShoppingCart size={17} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-ink-900">New order {order.number}</p>
              <p className="mt-0.5 truncate text-[12.5px] text-ink-600">
                {order.customer} · {formatGBP(order.total)}
              </p>
              <Link
                href={`/admin/orders/${order.id}`}
                onClick={() => setToasts((c) => c.filter((t) => t.id !== order.id))}
                className="mt-2 inline-block text-[12.5px] font-semibold text-brand-700 hover:underline"
              >
                Open order
              </Link>
            </div>
            <button
              onClick={() => setToasts((c) => c.filter((t) => t.id !== order.id))}
              className="shrink-0 rounded-lg p-1 text-ink-500 hover:bg-haze"
              aria-label="Dismiss"
            >
              <X size={15} />
            </button>
          </div>
          <div className="brand-gradient h-[3px] w-full" />
        </div>
      ))}

      <button
        onClick={toggleSound}
        className="pointer-events-auto ml-auto grid h-9 w-9 place-items-center rounded-full border border-line bg-white text-ink-600 shadow-card transition hover:text-brand-600"
        aria-label={soundOn ? "Mute new-order chime" : "Unmute new-order chime"}
        title={soundOn ? "Chime on" : "Chime off"}
      >
        {soundOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
      </button>
    </div>
  );
}
