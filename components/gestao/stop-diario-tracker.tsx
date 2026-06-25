"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn, formatBRLSinal } from "@/lib/utils";
import { Gauge, AlertOctagon, PartyPopper } from "lucide-react";

export function StopDiarioTracker({
  lucroHoje,
  stopLossDiario,
  stopGainDiario,
}: {
  lucroHoje: number;
  stopLossDiario: number;
  stopGainDiario: number;
}) {
  const stopLossBatido = lucroHoje <= -stopLossDiario;
  const stopGainBatido = lucroHoje >= stopGainDiario;

  const progressoPerda = stopLossDiario > 0 ? Math.min(100, Math.max(0, (-lucroHoje / stopLossDiario) * 100)) : 0;
  const progressoGanho = stopGainDiario > 0 ? Math.min(100, Math.max(0, (lucroHoje / stopGainDiario) * 100)) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Gauge className="size-4 text-gold" /> Tracker de Stop Diário
        </CardTitle>
        <CardDescription>Disciplina diária: respeite os limites antes de continuar operando.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center">
          <p className="text-[11px] text-muted-foreground">Lucro acumulado hoje</p>
          <p className={cn("text-3xl font-semibold tabular-nums", lucroHoje > 0 && "text-profit", lucroHoje < 0 && "text-loss")}>
            {formatBRLSinal(lucroHoje)}
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Stop loss ({formatBRLSinal(-stopLossDiario)})</span>
            <span>{progressoPerda.toFixed(0)}%</span>
          </div>
          <Progress value={progressoPerda} className="[&_[data-slot=progress-indicator]]:bg-loss" />
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Stop gain ({formatBRLSinal(stopGainDiario)})</span>
            <span>{progressoGanho.toFixed(0)}%</span>
          </div>
          <Progress value={progressoGanho} className="[&_[data-slot=progress-indicator]]:bg-profit" />
        </div>

        {stopLossBatido && (
          <div className="flex items-center gap-2 rounded-lg bg-loss/10 text-loss px-3 py-2.5 text-sm font-medium">
            <AlertOctagon className="size-4 shrink-0" />
            PARE — stop loss diário atingido.
          </div>
        )}
        {stopGainBatido && (
          <div className="flex items-center gap-2 rounded-lg bg-profit/10 text-profit px-3 py-2.5 text-sm font-medium">
            <PartyPopper className="size-4 shrink-0" />
            Meta do dia batida! Considere parar enquanto está bem.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
