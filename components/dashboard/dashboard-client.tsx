"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { Operacao, Configuracao, Liga, Metodo, Time } from "@/lib/types";
import { useFiltrosStore } from "@/lib/store/filters";
import { aplicarFiltros } from "@/lib/filter-operacoes";
import {
  calcularMetricas,
  distribuicaoTipo,
  lucroPorLiga,
  lucroPorMetodo,
  desempenhoPorFase,
  desempenhoPorFaixaMinuto,
} from "@/lib/calculations";
import { formatBRL, formatBRLSinal, cn } from "@/lib/utils";
import { FiltrosBar } from "@/components/dashboard/filtros-bar";
import { KpiCard } from "@/components/dashboard/kpi-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BancaChart } from "@/components/charts/banca-chart";
import { DrawdownChart } from "@/components/charts/drawdown-chart";
import { LucroPorMetodoChart } from "@/components/charts/lucro-por-metodo-chart";
import { LucroPorLigaChart } from "@/components/charts/lucro-por-liga-chart";
import { DistribuicaoTipoChart } from "@/components/charts/distribuicao-tipo-chart";
import {
  Wallet,
  TrendingUp,
  Percent,
  Target,
  Landmark,
  ListOrdered,
  TrendingDown,
  Flame,
  ShieldAlert,
  CalendarCheck2,
  CalendarX2,
  Award,
  Trophy,
  Clock,
} from "lucide-react";
import { EmptyDashboard } from "@/components/dashboard/empty-dashboard";

export function DashboardClient({
  operacoes,
  configuracao,
  ligas,
  metodos,
  times,
}: {
  operacoes: Operacao[];
  configuracao: Configuracao;
  ligas: Liga[];
  metodos: Metodo[];
  times: Time[];
}) {
  const filtros = useFiltrosStore();
  const filtradas = useMemo(() => aplicarFiltros(operacoes, filtros), [operacoes, filtros]);
  const metricas = useMemo(() => calcularMetricas(filtradas, configuracao.bancaInicial), [filtradas, configuracao.bancaInicial]);

  const porMetodo = useMemo(() => lucroPorMetodo(filtradas), [filtradas]);
  const porLiga = useMemo(() => lucroPorLiga(filtradas), [filtradas]);
  const porTipo = useMemo(() => distribuicaoTipo(filtradas), [filtradas]);
  const porFase = useMemo(() => desempenhoPorFase(filtradas), [filtradas]);
  const porFaixaMinuto = useMemo(() => desempenhoPorFaixaMinuto(filtradas), [filtradas]);

  const operacoesAbertas = useMemo(() => filtradas.filter((o) => o.status === "Aberta"), [filtradas]);

  if (operacoes.length === 0) {
    return <EmptyDashboard />;
  }

  const melhorMetodo = porMetodo[0];
  const melhorLiga = porLiga[0];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Visão geral da sua performance como trader esportivo.</p>
      </div>

      <FiltrosBar ligas={ligas} metodos={metodos} times={times} />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <KpiCard
          titulo="Lucro Realizado"
          valor={metricas.lucroTotal}
          formato="moedaSinal"
          tendencia={metricas.lucroTotal > 0 ? "up" : metricas.lucroTotal < 0 ? "down" : "flat"}
          tone={metricas.lucroTotal >= 0 ? "profit" : "loss"}
          icon={Wallet}
        />
        <KpiCard
          titulo="ROI Médio"
          valor={metricas.roi}
          formato="percent"
          tone={metricas.roi >= 0 ? "profit" : "loss"}
          icon={TrendingUp}
        />
        <KpiCard titulo="Yield" valor={metricas.yield} formato="percent" tone={metricas.yield >= 0 ? "profit" : "loss"} icon={Percent} />
        <KpiCard titulo="Taxa de Acerto" valor={metricas.taxaAcerto} formato="percent" tone="gold" icon={Target} />
        <KpiCard titulo="Banca Atual" valor={metricas.bancaAtual} formato="moeda" tone="neutral" icon={Landmark} />
        <KpiCard
          titulo="Exposição em Aberto"
          valor={metricas.exposicaoAberta}
          formato="moeda"
          subtitulo={`${metricas.numOperacoesAbertas} operações em andamento`}
          tone={metricas.exposicaoAberta > 0 ? "gold" : "neutral"}
          icon={ShieldAlert}
        />
        <KpiCard titulo="Nº de Operações" valor={metricas.numOperacoes} formato="numero" decimais={0} tone="neutral" icon={ListOrdered} />
        <KpiCard
          titulo="Drawdown Máximo"
          valor={metricas.drawdownMaximo}
          formato="moedaSinal"
          tone="loss"
          icon={TrendingDown}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Melhor dia</span>
              <CalendarCheck2 className="size-4 text-profit" />
            </div>
            {metricas.melhorDia ? (
              <>
                <p className="text-lg font-semibold tabular-nums text-profit">{formatBRLSinal(metricas.melhorDia.lucro)}</p>
                <p className="text-[11px] text-muted-foreground">{format(metricas.melhorDia.data, "dd/MM/yyyy", { locale: ptBR })}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Pior dia</span>
              <CalendarX2 className="size-4 text-loss" />
            </div>
            {metricas.piorDia ? (
              <>
                <p className="text-lg font-semibold tabular-nums text-loss">{formatBRLSinal(metricas.piorDia.lucro)}</p>
                <p className="text-[11px] text-muted-foreground">{format(metricas.piorDia.data, "dd/MM/yyyy", { locale: ptBR })}</p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Melhor método</span>
              <Award className="size-4 text-gold" />
            </div>
            {melhorMetodo ? (
              <>
                <p className="text-sm font-semibold truncate">{melhorMetodo.metodo}</p>
                <p className={cn("text-[11px] tabular-nums", melhorMetodo.lucro >= 0 ? "text-profit" : "text-loss")}>
                  {formatBRLSinal(melhorMetodo.lucro)}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Melhor liga</span>
              <Trophy className="size-4 text-gold" />
            </div>
            {melhorLiga ? (
              <>
                <p className="text-sm font-semibold truncate">{melhorLiga.liga}</p>
                <p className={cn("text-[11px] tabular-nums", melhorLiga.lucro >= 0 ? "text-profit" : "text-loss")}>
                  {formatBRLSinal(melhorLiga.lucro)}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">—</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Maior sequência</span>
              <Flame className="size-4 text-profit" />
            </div>
            <p className="text-lg font-semibold tabular-nums text-profit">{metricas.maiorSequenciaGreens} greens</p>
            <p className="text-[11px] text-muted-foreground">recorde de acertos seguidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Maior sequência negativa</span>
              <Flame className="size-4 text-loss" />
            </div>
            <p className="text-lg font-semibold tabular-nums text-loss">{metricas.maiorSequenciaReds} reds</p>
            <p className="text-[11px] text-muted-foreground">recorde de erros seguidos</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Sequência atual</span>
              <Flame className={cn("size-4", metricas.streakTipo === "Red" ? "text-loss" : "text-profit")} />
            </div>
            <p className={cn("text-lg font-semibold tabular-nums", metricas.streakTipo === "Red" ? "text-loss" : "text-profit")}>
              {metricas.streakAtual} {metricas.streakTipo === "Red" ? "reds" : "greens"}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-muted-foreground">Operações em aberto</span>
              <Clock className="size-4 text-gold" />
            </div>
            <p className="text-lg font-semibold tabular-nums">{operacoesAbertas.length}</p>
            <p className="text-[11px] text-muted-foreground">{formatBRL(metricas.exposicaoAberta)} em exposição</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-sm font-medium text-muted-foreground">Desempenho por fase e por minuto de entrada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[...porFase, ...porFaixaMinuto].map((stat) => (
              <div key={stat.label} className="rounded-lg border p-3">
                <p className="text-xs text-muted-foreground mb-1">{stat.label}</p>
                <p className={cn("text-base font-semibold tabular-nums", stat.lucro >= 0 ? "text-profit" : "text-loss")}>
                  {formatBRLSinal(stat.lucro)}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {stat.numOperacoes} operações · {stat.taxaAcerto.toFixed(1)}% acerto
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

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
