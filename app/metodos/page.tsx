import { getMetodos } from "@/lib/actions/metodos";
import { getConfiguracao } from "@/lib/actions/configuracao";
import { getOperacoes } from "@/lib/actions/operacoes";
import { calcularMetricas } from "@/lib/calculations";
import { calcValorStakeFixa } from "@/lib/stake";
import { MetodosClient } from "@/components/metodos/metodos-client";

export const dynamic = "force-dynamic";

export default async function MetodosPage() {
  const [metodos, configuracao, operacoes] = await Promise.all([getMetodos(), getConfiguracao(), getOperacoes()]);
  const metricas = calcularMetricas(operacoes, configuracao.bancaInicial);
  const valorStakeFixa = calcValorStakeFixa(configuracao, metricas.bancaAtual);

  return <MetodosClient metodos={metodos} valorStakeFixa={valorStakeFixa} />;
}
