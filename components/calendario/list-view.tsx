"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Operacao } from "@/lib/types";
import { operacoesPorDia } from "@/lib/calculations";
import { Card, CardContent } from "@/components/ui/card";
import { cn, formatU } from "@/lib/utils";

export function ListView({ operacoes, onSelectDay }: { operacoes: Operacao[]; onSelectDay: (data: Date) => void }) {
  const porDia = operacoesPorDia(operacoes);
  const dias = Array.from(porDia.keys()).sort((a, b) => (a < b ? 1 : -1));

  if (dias.length === 0) {
    return <p className="text-sm text-muted-foreground text-center py-12">Nenhuma operação neste mês.</p>;
  }

  return (
    <div className="space-y-2">
      {dias.map((key) => {
        const ops = porDia.get(key)!;
        const lucro = ops.reduce((acc, o) => acc + o.lucro, 0);
        const data = new Date(key + "T00:00:00");
        return (
          <Card key={key} className="cursor-pointer hover:bg-accent/30 transition-colors" onClick={() => onSelectDay(data)}>
            <CardContent className="p-3 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium capitalize">{format(data, "EEEE, d 'de' MMMM", { locale: ptBR })}</p>
                <p className="text-xs text-muted-foreground">{ops.length} operações</p>
              </div>
              <span className={cn("text-sm font-semibold tabular-nums", lucro > 0 && "text-profit", lucro < 0 && "text-loss")}>
                {formatU(lucro, 2)}
              </span>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
