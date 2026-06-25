"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { calcResponsabilidade } from "@/lib/calculations";
import { cn, formatBRL } from "@/lib/utils";
import { Calculator, AlertTriangle } from "lucide-react";

const LIMITE_RISCO_PERCENT = 5;

export function StakeCalculator({ bancaAtual }: { bancaAtual: number }) {
  const [banca, setBanca] = useState(bancaAtual);
  const [stakePercent, setStakePercent] = useState(2);
  const [oddLay, setOddLay] = useState(3.0);

  const { stakeRecomendada, responsabilidade, riscoPercent } = useMemo(() => {
    const stake = (banca * stakePercent) / 100;
    const resp = calcResponsabilidade(stake, oddLay);
    const risco = banca > 0 ? (resp / banca) * 100 : 0;
    return { stakeRecomendada: stake, responsabilidade: resp, riscoPercent: risco };
  }, [banca, stakePercent, oddLay]);

  const riscoAlto = riscoPercent > LIMITE_RISCO_PERCENT;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Calculator className="size-4 text-gold" /> Calculadora de Stake
        </CardTitle>
        <CardDescription>Calcule a stake e a responsabilidade ideais para uma operação de lay.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Banca atual (R$)</Label>
            <Input type="number" step="1" value={banca} onChange={(e) => setBanca(Number(e.target.value) || 0)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Stake (%)</Label>
            <Input
              type="number"
              step="0.1"
              value={stakePercent}
              onChange={(e) => setStakePercent(Number(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Odd lay pretendida</Label>
            <Input type="number" step="0.01" value={oddLay} onChange={(e) => setOddLay(Number(e.target.value) || 0)} />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 pt-2 border-t">
          <Resultado label="Stake recomendada" valor={formatBRL(stakeRecomendada)} />
          <Resultado label="Responsabilidade" valor={formatBRL(responsabilidade)} />
          <Resultado
            label="% da banca em risco"
            valor={`${riscoPercent.toFixed(1)}%`}
            tone={riscoAlto ? "loss" : "profit"}
          />
        </div>

        {riscoAlto && (
          <div className="flex items-center gap-2 rounded-lg bg-loss/10 text-loss px-3 py-2 text-sm">
            <AlertTriangle className="size-4 shrink-0" />
            Risco acima de {LIMITE_RISCO_PERCENT}% da banca. Considere reduzir a stake ou a odd lay.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Resultado({
  label,
  valor,
  tone,
}: {
  label: string;
  valor: string;
  tone?: "profit" | "loss";
}) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className={cn("text-lg font-semibold tabular-nums", tone === "profit" && "text-profit", tone === "loss" && "text-loss")}>
        {valor}
      </p>
    </div>
  );
}
