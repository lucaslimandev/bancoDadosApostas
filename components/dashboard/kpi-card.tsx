"use client";

import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { AnimatedNumber } from "@/components/ui/animated-number";
import { cn, formatBRL } from "@/lib/utils";

export function KpiCard({
  titulo,
  valorU,
  valorEmDinheiro = true,
  valorUnidade,
  sufixo = "u",
  decimais = 1,
  tendencia,
  icon: Icon,
  tone = "neutral",
}: {
  titulo: string;
  valorU: number;
  valorEmDinheiro?: boolean;
  valorUnidade: number;
  sufixo?: string;
  decimais?: number;
  tendencia?: "up" | "down" | "flat";
  icon: LucideIcon;
  tone?: "profit" | "loss" | "neutral" | "gold";
}) {
  const toneClasses = {
    profit: "text-profit bg-profit/10",
    loss: "text-loss bg-loss/10",
    gold: "text-gold bg-gold/15",
    neutral: "text-foreground bg-muted",
  }[tone];

  const TrendIcon = tendencia === "up" ? ArrowUpRight : tendencia === "down" ? ArrowDownRight : Minus;
  const trendClass =
    tendencia === "up" ? "text-profit" : tendencia === "down" ? "text-loss" : "text-muted-foreground";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="overflow-hidden">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-muted-foreground">{titulo}</span>
            <div className={cn("flex size-8 items-center justify-center rounded-lg", toneClasses)}>
              <Icon className="size-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold tabular-nums tracking-tight">
              <AnimatedNumber value={valorU} decimals={decimais} suffix={sufixo} />
            </span>
            {tendencia && <TrendIcon className={cn("size-4", trendClass)} />}
          </div>
          {valorEmDinheiro && (
            <span className="text-xs text-muted-foreground">{formatBRL(valorU * valorUnidade)}</span>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
