"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Configuracao } from "@/lib/types";
import { atualizarConfiguracao } from "@/lib/actions/configuracao";
import { calcValorStakeFixa } from "@/lib/stake";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { formatBRL } from "@/lib/utils";
import { Settings, Coins } from "lucide-react";

export function ConfiguracaoForm({ configuracao, bancaAtual }: { configuracao: Configuracao; bancaAtual: number }) {
  const router = useRouter();
  const [valores, setValores] = useState({
    bancaInicial: configuracao.bancaInicial,
    stakeModo: configuracao.stakeModo,
    stakeValor: configuracao.stakeValor,
    stakePercentual: configuracao.stakePercentual,
    stopLossDiario: configuracao.stopLossDiario,
    stopGainDiario: configuracao.stopGainDiario,
    maxOperacoesSimultaneas: configuracao.maxOperacoesSimultaneas,
  });
  const [salvando, setSalvando] = useState(false);

  function atualizar<K extends keyof typeof valores>(campo: K, valor: (typeof valores)[K]) {
    setValores((v) => ({ ...v, [campo]: valor }));
  }

  const valorStakeFixa = useMemo(
    () => calcValorStakeFixa({ stakeModo: valores.stakeModo, stakeValor: valores.stakeValor, stakePercentual: valores.stakePercentual }, bancaAtual),
    [valores.stakeModo, valores.stakeValor, valores.stakePercentual, bancaAtual]
  );

  async function handleSalvar() {
    setSalvando(true);
    try {
      await atualizarConfiguracao({ ...valores, tema: configuracao.tema as "dark" | "light" });
      toast.success("Configurações salvas.");
      router.refresh();
    } catch (e) {
      toast.error("Não foi possível salvar.");
      console.error(e);
    } finally {
      setSalvando(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-base">
              <Settings className="size-4 text-gold" /> Parâmetros da Banca
            </CardTitle>
            <CardDescription>Esses valores alimentam os cálculos de risco e KPIs em todo o app.</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Tema</span>
            <ThemeToggle />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <Campo label="Banca inicial (R$)" valor={valores.bancaInicial} onChange={(v) => atualizar("bancaInicial", v)} />
          <Campo label="Stop loss diário (R$)" valor={valores.stopLossDiario} onChange={(v) => atualizar("stopLossDiario", v)} />
          <Campo label="Stop gain diário (R$)" valor={valores.stopGainDiario} onChange={(v) => atualizar("stopGainDiario", v)} />
          <Campo
            label="Máx. operações simultâneas"
            valor={valores.maxOperacoesSimultaneas}
            step={1}
            onChange={(v) => atualizar("maxOperacoesSimultaneas", v)}
          />
        </div>

        <div className="space-y-3 rounded-lg border p-3">
          <div className="flex items-center gap-2">
            <Coins className="size-4 text-gold" />
            <Label className="text-sm font-medium">Stake fixa</Label>
          </div>
          <p className="text-xs text-muted-foreground">
            Defina a unidade base de aposta. Os modelos configuram quantas stakes usam — você sempre entra em
            múltiplos da stake fixa.
          </p>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Modo</Label>
              <Select value={valores.stakeModo} onValueChange={(v) => atualizar("stakeModo", v as typeof valores.stakeModo)}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Valor">Valor fixo (R$)</SelectItem>
                  <SelectItem value="Percentual">Percentual da banca</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {valores.stakeModo === "Valor" ? (
              <Campo label="Valor da stake (R$)" valor={valores.stakeValor} onChange={(v) => atualizar("stakeValor", v)} />
            ) : (
              <Campo label="% da banca" valor={valores.stakePercentual} step={0.1} onChange={(v) => atualizar("stakePercentual", v)} />
            )}
          </div>

          <div className="flex items-center justify-between rounded-lg bg-gold/10 px-3 py-2.5">
            <span className="text-sm text-muted-foreground">1 stake equivale a</span>
            <span className="text-lg font-semibold text-gold tabular-nums">{formatBRL(valorStakeFixa)}</span>
          </div>
          {valores.stakeModo === "Percentual" && (
            <p className="text-[11px] text-muted-foreground">
              Calculado sobre a banca atual ({formatBRL(bancaAtual)}). Recalcula automaticamente conforme seu resultado.
            </p>
          )}
        </div>

        <Button onClick={handleSalvar} disabled={salvando}>
          Salvar configurações
        </Button>
      </CardContent>
    </Card>
  );
}

function Campo({
  label,
  valor,
  onChange,
  step = 0.1,
}: {
  label: string;
  valor: number;
  onChange: (v: number) => void;
  step?: number;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs">{label}</Label>
      <Input type="number" step={step} value={valor} onChange={(e) => onChange(Number(e.target.value) || 0)} />
    </div>
  );
}
