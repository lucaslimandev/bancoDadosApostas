"use client";

import { Bar, BarChart, CartesianGrid, Cell, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/charts/banca-chart";

export function HistoricoMensalChart({
  dados,
}: {
  dados: Array<{ mes: string; lucro: number; meta: number }>;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm font-medium text-muted-foreground">Histórico mensal: realizado vs meta (u)</CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        {dados.length === 0 ? (
          <EmptyState />
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dados} margin={{ top: 4, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" />
              <XAxis dataKey="mes" tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "var(--color-muted-foreground)" }} tickLine={false} axisLine={false} width={40} />
              <Tooltip
                contentStyle={{ background: "var(--color-popover)", border: "1px solid var(--color-border)", borderRadius: 8, fontSize: 12 }}
                formatter={(v) => `${Number(v).toFixed(2)}u`}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="meta" name="Meta" fill="var(--color-muted-foreground)" radius={[6, 6, 0, 0]} opacity={0.4} />
              <Bar dataKey="lucro" name="Realizado" radius={[6, 6, 0, 0]}>
                {dados.map((d, i) => (
                  <Cell key={i} fill={d.lucro >= 0 ? "var(--color-profit)" : "var(--color-loss)"} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
