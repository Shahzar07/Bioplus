import { formatGBP } from "@/lib/cn";

/**
 * Thirty-day revenue, drawn as a plain bar chart in SVG.
 *
 * Deliberately dependency-free: one small chart does not justify shipping a
 * charting library to a dashboard that should load instantly.
 */
export function RevenueChart({ series }: { series: { date: Date; total: number }[] }) {
  const max = Math.max(...series.map((d) => d.total), 1);
  const width = 100;
  const height = 32;
  const gap = 0.6;
  const barWidth = width / series.length - gap;

  const formatDay = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "short" });

  return (
    <div className="px-5 pb-5">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-28 w-full"
        role="img"
        aria-label={`Revenue over the last ${series.length} days`}
      >
        {series.map((point, index) => {
          // Give a day with sales at least a sliver of height so it is visible.
          const barHeight = point.total > 0 ? Math.max((point.total / max) * height, 1.2) : 0;
          return (
            <rect
              key={point.date.toISOString()}
              x={index * (barWidth + gap)}
              y={height - barHeight}
              width={barWidth}
              height={barHeight}
              rx={0.6}
              className="fill-brand-500"
            >
              <title>
                {formatDay.format(point.date)} — {formatGBP(point.total)}
              </title>
            </rect>
          );
        })}
      </svg>
      <div className="mt-2 flex justify-between text-[11px] text-ink-500">
        <span>{formatDay.format(series[0]?.date ?? new Date())}</span>
        <span>Peak {formatGBP(max)}</span>
        <span>{formatDay.format(series.at(-1)?.date ?? new Date())}</span>
      </div>
    </div>
  );
}
