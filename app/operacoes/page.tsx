import { getOperacoes } from "@/lib/actions/operacoes";
import { getLigasAtivas } from "@/lib/actions/ligas";
import { getMetodosAtivos } from "@/lib/actions/metodos";
import { getTimesAtivos } from "@/lib/actions/times";
import { getConfiguracao } from "@/lib/actions/configuracao";
import { calcularMetricas } from "@/lib/calculations";
import { calcValorStakeFixa } from "@/lib/stake";
import { OperacoesClient } from "@/components/operacoes/operacoes-client";

export const dynamic = "force-dynamic";

export default async function OperacoesPage() {
  const [operacoes, ligas, metodos, times, configuracao] = await Promise.all([
    getOperacoes(),
    getLigasAtivas(),
    getMetodosAtivos(),
    getTimesAtivos(),
    getConfiguracao(),
  ]);
  const metricas = calcularMetricas(operacoes, configuracao.bancaInicial);
  const valorStakeFixa = calcValorStakeFixa(configuracao, metricas.bancaAtual);

  return (
    <OperacoesClient operacoes={operacoes} ligas={ligas} metodos={metodos} times={times} valorStakeFixa={valorStakeFixa} />
  );
}
