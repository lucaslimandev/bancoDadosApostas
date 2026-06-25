"use client";

import { useMemo, useState } from "react";
import { addMonths, format, subMonths } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Operacao, Configuracao } from "@/lib/types";
import { diaKey, operacoesPorDia } from "@/lib/calculations";
import { MonthGrid, type DiaResumo } from "@/components/calendario/month-grid";
import { ListView } from "@/components/calendario/list-view";
import { DayPanel } from "@/components/calendario/day-panel";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function CalendarioClient({ operacoes, configuracao }: { operacoes: Operacao[]; configuracao: Configuracao }) {
  const [mesAtual, setMesAtual] = useState(new Date());
  const [visao, setVisao] = useState<"mes" | "lista">("mes");
  const [diaSelecionado, setDiaSelecionado] = useState<Date | null>(null);

  const porDia = useMemo(() => operacoesPorDia(operacoes), [operacoes]);

  const resumosPorDia = useMemo(() => {
    const mapa = new Map<string, DiaResumo>();
    for (const [key, ops] of porDia) {
      const lucro = ops.reduce((acc, o) => acc + o.lucro, 0);
      mapa.set(key, {
        lucro,
        numOperacoes: ops.length,
        stopLossBatido: lucro <= -configuracao.stopLossDiario,
        stopGainBatido: lucro >= configuracao.stopGainDiario,
      });
    }
    return mapa;
  }, [porDia, configuracao.stopLossDiario, configuracao.stopGainDiario]);

  const maxAbsLucro = useMemo(
    () => Math.max(1, ...Array.from(resumosPorDia.values()).map((r) => Math.abs(r.lucro))),
    [resumosPorDia]
  );

  const operacoesDoMes = useMemo(
    () =>
      operacoes.filter((op) => {
        const d = new Date(op.data);
        return d.getFullYear() === mesAtual.getFullYear() && d.getMonth() === mesAtual.getMonth();
      }),
    [operacoes, mesAtual]
  );

  const operacoesDoDiaSelecionado = diaSelecionado ? porDia.get(diaKey(diaSelecionado)) ?? [] : [];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Calendário</h1>
          <p className="text-sm text-muted-foreground">Acompanhe seu lucro diário e detalhes de cada operação.</p>
        </div>
        <Tabs value={visao} onValueChange={(v) => setVisao(v as "mes" | "lista")}>
          <TabsList>
            <TabsTrigger value="mes">Mês</TabsTrigger>
            <TabsTrigger value="lista">Lista</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between mb-4">
        <Button variant="outline" size="icon" onClick={() => setMesAtual(subMonths(mesAtual, 1))}>
          <ChevronLeft className="size-4" />
        </Button>
        <span className="text-sm font-medium capitalize">{format(mesAtual, "MMMM 'de' yyyy", { locale: ptBR })}</span>
        <Button variant="outline" size="icon" onClick={() => setMesAtual(addMonths(mesAtual, 1))}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {visao === "mes" ? (
        <MonthGrid
          mesAtual={mesAtual}
          resumosPorDia={resumosPorDia}
          maxAbsLucro={maxAbsLucro}
          onSelectDay={setDiaSelecionado}
        />
      ) : (
        <ListView operacoes={operacoesDoMes} onSelectDay={setDiaSelecionado} />
      )}

      <DayPanel data={diaSelecionado} operacoes={operacoesDoDiaSelecionado} onClose={() => setDiaSelecionado(null)} />
    </div>
  );
}
