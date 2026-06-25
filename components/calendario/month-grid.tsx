"use client";

import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  format,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn, formatBRLCompacto } from "@/lib/utils";
import { diaKey } from "@/lib/calculations";
import { AlertTriangle, Trophy } from "lucide-react";

const DIAS_SEMANA = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

export type DiaResumo = {
  lucro: number;
  numOperacoes: number;
  stopLossBatido: boolean;
  stopGainBatido: boolean;
};

export function MonthGrid({
  mesAtual,
  resumosPorDia,
  maxAbsLucro,
  onSelectDay,
}: {
  mesAtual: Date;
  resumosPorDia: Map<string, DiaResumo>;
  maxAbsLucro: number;
  onSelectDay: (data: Date) => void;
}) {
  const inicio = startOfWeek(startOfMonth(mesAtual), { locale: ptBR });
  const fim = endOfWeek(endOfMonth(mesAtual), { locale: ptBR });
  const dias = eachDayOfInterval({ start: inicio, end: fim });

  return (
    <div className="rounded-lg border overflow-hidden">
      <div className="grid grid-cols-7 bg-muted/50 border-b">
        {DIAS_SEMANA.map((d) => (
          <div key={d} className="text-center text-xs font-medium text-muted-foreground py-2">
            {d}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {dias.map((dia) => {
          const key = diaKey(dia);
          const resumo = resumosPorDia.get(key);
          const dentroDoMes = isSameMonth(dia, mesAtual);
          const intensidade = resumo && maxAbsLucro > 0 ? Math.min(1, Math.abs(resumo.lucro) / maxAbsLucro) : 0;

          const bgStyle = resumo
            ? resumo.lucro > 0
              ? { backgroundColor: `color-mix(in oklch, var(--color-profit) ${20 + intensidade * 45}%, transparent)` }
              : resumo.lucro < 0
                ? { backgroundColor: `color-mix(in oklch, var(--color-loss) ${20 + intensidade * 45}%, transparent)` }
                : undefined
            : undefined;

          return (
            <button
              key={key}
              onClick={() => onSelectDay(dia)}
              disabled={!dentroDoMes}
              className={cn(
                "relative flex flex-col items-start justify-between aspect-square sm:aspect-auto sm:h-24 p-1.5 sm:p-2 border-b border-r text-left transition-colors",
                !dentroDoMes && "opacity-30 pointer-events-none bg-muted/20",
                dentroDoMes && "hover:bg-accent/40 cursor-pointer"
              )}
              style={dentroDoMes ? bgStyle : undefined}
            >
              <span
                className={cn(
                  "text-xs font-medium",
                  isToday(dia) && "flex size-5 items-center justify-center rounded-full bg-gold text-gold-foreground"
                )}
              >
                {format(dia, "d")}
              </span>

              {resumo && dentroDoMes && (
                <div className="w-full flex flex-col gap-0.5">
                  <span
                    className={cn(
                      "text-[11px] font-semibold tabular-nums",
                      resumo.lucro > 0 && "text-profit",
                      resumo.lucro < 0 && "text-loss",
                      resumo.lucro === 0 && "text-muted-foreground"
                    )}
                  >
                    {formatBRLCompacto(resumo.lucro)}
                  </span>
                  <div className="flex items-center gap-1">
                    {resumo.stopLossBatido && (
                      <span title="Stop loss batido" className="text-loss">
                        <AlertTriangle className="size-3" />
                      </span>
                    )}
                    {resumo.stopGainBatido && (
                      <span title="Stop gain batido" className="text-gold">
                        <Trophy className="size-3" />
                      </span>
                    )}
                  </div>
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
