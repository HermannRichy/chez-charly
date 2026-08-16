"use client";

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts";
import { fmtNumber } from "@/lib/format";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";

const chartConfig = {
  revenue: { label: "Chiffre d'affaires", color: "var(--color-primary)" },
} satisfies ChartConfig;

export function RevenueChart({ data }: { data: { label: string; revenue: number }[] }) {
  const allZero = data.every((d) => d.revenue === 0);

  return (
    <div className="bg-card border border-border rounded-xl p-5 min-w-0">
      <div className="text-[11.5px] font-bold tracking-[.1em] text-muted-foreground">
        CHIFFRE D&apos;AFFAIRES · 7 DERNIERS JOURS
      </div>

      {allZero ? (
        <div className="h-56 grid place-items-center text-sm text-muted-foreground">
          Pas encore de commande sur cette période.
        </div>
      ) : (
        <ChartContainer config={chartConfig} className="h-56 w-full min-w-0 mt-2">
          <LineChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid vertical={false} stroke="var(--color-border)" strokeDasharray="3 3" />
            <XAxis
              dataKey="label"
              tickLine={false}
              axisLine={false}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              width={56}
              tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }}
              tickFormatter={(v) => fmtNumber(v)}
            />
            <ChartTooltip content={<ChartTooltipContent formatter={(v) => `${fmtNumber(Number(v))} F`} />} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="var(--color-primary)"
              strokeWidth={2.5}
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </LineChart>
        </ChartContainer>
      )}
    </div>
  );
}
