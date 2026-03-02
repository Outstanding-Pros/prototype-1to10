"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { TrendingUpIcon, TrendingDownIcon, MinusIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface KpiCardProps {
  label: string;
  value: string;
  changePercent: number;
  sparklineData: number[];
  color: string;
  description?: string;
}

export default function KpiCard({
  label,
  value,
  changePercent,
  sparklineData,
  color,
  description,
}: KpiCardProps) {
  const isPositive = changePercent > 0;
  const isNeutral = changePercent === 0;

  const chartData = sparklineData.map((v, i) => ({ v, i }));

  const card = (
    <div className="rounded-lg border bg-card p-4 space-y-2">
      <p className="text-xs text-muted-foreground font-medium">{label}</p>
      <div className="flex items-end justify-between gap-2">
        <div className="space-y-1 min-w-0">
          <p className="text-xl font-bold tabular-nums truncate">{value}</p>
          <div className="flex items-center gap-1 text-xs">
            {isNeutral ? (
              <MinusIcon className="size-3 text-muted-foreground" />
            ) : isPositive ? (
              <TrendingUpIcon className="size-3 text-green-500" />
            ) : (
              <TrendingDownIcon className="size-3 text-destructive" />
            )}
            <span
              className={
                isNeutral
                  ? "text-muted-foreground"
                  : isPositive
                  ? "text-green-500"
                  : "text-destructive"
              }
            >
              {isPositive ? "+" : ""}
              {changePercent.toFixed(1)}%
            </span>
            <span className="text-muted-foreground">7d</span>
          </div>
        </div>
        <div className="w-20 h-8 flex-shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <Line
                type="monotone"
                dataKey="v"
                stroke={color}
                strokeWidth={1.5}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );

  if (!description) return card;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{card}</TooltipTrigger>
      <TooltipContent side="bottom" sideOffset={4} className="max-w-64">
        <p className="font-medium mb-0.5">{label}</p>
        <p className="text-muted-foreground">{description}</p>
      </TooltipContent>
    </Tooltip>
  );
}
