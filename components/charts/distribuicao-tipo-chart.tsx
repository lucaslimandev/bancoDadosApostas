"use client";

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/charts/banca-chart";

const CORES: Record<string, string> = {
  Lay: "var(--color-chart-2)",
  Back: "var(--color-chart-1)",
  Trade: "var(--color-gold)",
};

export function DistribuicaoTipoChart({ dados }: { dados: Array<{ tipo: string; quantidade: number }> }) {
  const total = dados.reduce((acc, d) => acc + d.quantidade, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Distribuição por tipo</CardTitle>
      </CardHeader>
      <CardContent className="h-64 flex flex-col">
        {dados.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <div className="relative flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={dados} dataKey="quantidade" nameKey="tipo" innerRadius={55} outerRadius={85} paddingAngle={3}>
                    {dados.map((d, i) => (
                      <Cell key={i} fill={CORES[d.tipo] ?? "var(--color-chart-3)"} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                    formatter={(v, n) => [`${v} operações`, n]}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-xl font-semibold">{total}</span>
                <span className="text-[11px] text-muted-foreground">operações</span>
              </div>
            </div>
            <div className="flex justify-center gap-4">
              {dados.map((d) => (
                <div key={d.tipo} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <span className="size-2 rounded-full" style={{ background: CORES[d.tipo] }} />
                  {d.tipo}
                </div>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
