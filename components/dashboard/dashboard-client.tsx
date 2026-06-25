"use client";

import { useMemo } from "react";
import type { Operacao, Configuracao } from "@/lib/types";
import { useFiltrosStore } from "@/lib/store/filters";
import { aplicarFiltros } from "@/lib/filter-operacoes";
import { calcularMetricas, distribuicaoTipo, lucroPorLiga, lucroPorMetodo } from "@/lib/calculations";
import { FiltrosBar } from "@/components/dashboard/filtros-bar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { BancaChart } from "@/components/charts/banca-chart";
import { DrawdownChart } from "@/components/charts/drawdown-chart";
import { LucroPorMetodoChart } from "@/components/charts/lucro-por-metodo-chart";
import { LucroPorLigaChart } from "@/components/charts/lucro-por-liga-chart";
import { DistribuicaoTipoChart } from "@/components/charts/distribuicao-tipo-chart";
import { Wallet, TrendingUp, Percent, Target, Landmark, ListOrdered, TrendingDown, Flame } from "lucide-react";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";

export function DashboardClient({ operacoes, configuracao }: { operacoes: Operacao[]; configuracao: Configuracao }) {
  const filtros = useFiltrosStore();
  const filtradas = useMemo(() => aplicarFiltros(operacoes, filtros), [operacoes, filtros]);
  const metricas = useMemo(() => calcularMetricas(filtradas, configuracao.bancaInicial), [filtradas, configuracao.bancaInicial]);

  const porMetodo = useMemo(() => lucroPorMetodo(filtradas), [filtradas]);
  const porLiga = useMemo(() => lucroPorLiga(filtradas), [filtradas]);
  const porTipo = useMemo(() => distribuicaoTipo(filtradas), [filtradas]);

  if (operacoes.length === 0) {
    return <EmptyDashboard />;
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da sua performance como trader esportivo.</p>
      </div>

      <FiltrosBar />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard
          titulo="Lucro Total"
          valorU={metricas.lucroTotal}
          valorUnidade={configuracao.valorUnidade}
          tendencia={metricas.lucroTotal > 0 ? "up" : metricas.lucroTotal < 0 ? "down" : "flat"}
          tone={metricas.lucroTotal >= 0 ? "profit" : "loss"}
          icon={Wallet}
        />
        <KpiCard
          titulo="ROI Médio"
          valorU={metricas.roi}
          valorUnidade={configuracao.valorUnidade}
          valorEmDinheiro={false}
          sufixo="%"
          tone={metricas.roi >= 0 ? "profit" : "loss"}
          icon={TrendingUp}
        />
        <KpiCard
          titulo="Yield"
          valorU={metricas.yield}
          valorUnidade={configuracao.valorUnidade}
          valorEmDinheiro={false}
          sufixo="%"
          tone={metricas.yield >= 0 ? "profit" : "loss"}
          icon={Percent}
        />
        <KpiCard
          titulo="Taxa de Acerto"
          valorU={metricas.taxaAcerto}
          valorUnidade={configuracao.valorUnidade}
          valorEmDinheiro={false}
          sufixo="%"
          tone="gold"
          icon={Target}
        />
        <KpiCard
          titulo="Banca Atual"
          valorU={metricas.bancaAtual}
          valorUnidade={configuracao.valorUnidade}
          tone="neutral"
          icon={Landmark}
        />
        <KpiCard
          titulo="Nº de Operações"
          valorU={metricas.numOperacoes}
          valorUnidade={configuracao.valorUnidade}
          valorEmDinheiro={false}
          decimais={0}
          sufixo=""
          tone="neutral"
          icon={ListOrdered}
        />
        <KpiCard
          titulo="Drawdown Máximo"
          valorU={metricas.drawdownMaximo}
          valorUnidade={configuracao.valorUnidade}
          tone="loss"
          icon={TrendingDown}
        />
        <KpiCard
          titulo="Sequência Atual"
          valorU={metricas.streakAtual}
          valorUnidade={configuracao.valorUnidade}
          valorEmDinheiro={false}
          decimais={0}
          sufixo={metricas.streakTipo === "Red" ? " reds" : " greens"}
          tone={metricas.streakTipo === "Red" ? "loss" : "profit"}
          icon={Flame}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BancaChart serie={metricas.serie} />
        <DrawdownChart serie={metricas.serie} />
        <LucroPorMetodoChart dados={porMetodo} />
        <LucroPorLigaChart dados={porLiga} />
        <DistribuicaoTipoChart dados={porTipo} />
      </div>
    </div>
  );
}
