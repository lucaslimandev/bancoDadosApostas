"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Configuracao } from "@/lib/types";
import { atualizarConfiguracao } from "@/lib/actions/configuracao";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Settings } from "lucide-react";

export function ConfiguracaoForm({ configuracao }: { configuracao: Configuracao }) {
  const router = useRouter();
  const [valores, setValores] = useState({
    bancaInicial: configuracao.bancaInicial,
    valorUnidade: configuracao.valorUnidade,
    stopLossDiario: configuracao.stopLossDiario,
    stopGainDiario: configuracao.stopGainDiario,
    stakePadraoPercent: configuracao.stakePadraoPercent,
    maxOperacoesSimultaneas: configuracao.maxOperacoesSimultaneas,
  });
  const [salvando, setSalvando] = useState(false);

  function atualizar<K extends keyof typeof valores>(campo: K, valor: number) {
    setValores((v) => ({ ...v, [campo]: valor }));
  }

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
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Campo
            label="Banca inicial (u)"
            valor={valores.bancaInicial}
            onChange={(v) => atualizar("bancaInicial", v)}
          />
          <Campo
            label="Valor da unidade (R$)"
            valor={valores.valorUnidade}
            onChange={(v) => atualizar("valorUnidade", v)}
          />
          <Campo
            label="Stop loss diário (u)"
            valor={valores.stopLossDiario}
            onChange={(v) => atualizar("stopLossDiario", v)}
          />
          <Campo
            label="Stop gain diário (u)"
            valor={valores.stopGainDiario}
            onChange={(v) => atualizar("stopGainDiario", v)}
          />
          <Campo
            label="Stake padrão (%)"
            valor={valores.stakePadraoPercent}
            onChange={(v) => atualizar("stakePadraoPercent", v)}
          />
          <Campo
            label="Máx. operações simultâneas"
            valor={valores.maxOperacoesSimultaneas}
            step={1}
            onChange={(v) => atualizar("maxOperacoesSimultaneas", v)}
          />
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
