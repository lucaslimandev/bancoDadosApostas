import { getOperacoes } from "@/lib/actions/operacoes";
import { getConfiguracao } from "@/lib/actions/configuracao";
import { getLigasAtivas } from "@/lib/actions/ligas";
import { getMetodosAtivos } from "@/lib/actions/metodos";
import { getTimesAtivos } from "@/lib/actions/times";
import { calcularMetricas } from "@/lib/calculations";
import { calcValorStakeFixa } from "@/lib/stake";
import { CalendarioClient } from "@/components/calendario/calendario-client";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const [operacoes, configuracao, ligas, metodos, times] = await Promise.all([
    getOperacoes(),
    getConfiguracao(),
    getLigasAtivas(),
    getMetodosAtivos(),
    getTimesAtivos(),
  ]);
  const metricas = calcularMetricas(operacoes, configuracao.bancaInicial);
  const valorStakeFixa = calcValorStakeFixa(configuracao, metricas.bancaAtual);
  return (
    <CalendarioClient
      operacoes={operacoes}
      configuracao={configuracao}
      ligas={ligas}
      metodos={metodos}
      times={times}
      valorStakeFixa={valorStakeFixa}
    />
  );
}
