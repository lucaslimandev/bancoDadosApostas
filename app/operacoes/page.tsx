import { getOperacoes } from "@/lib/actions/operacoes";
import { getLigasAtivas } from "@/lib/actions/ligas";
import { getMetodosAtivos } from "@/lib/actions/metodos";
import { getTimesAtivos } from "@/lib/actions/times";
import { OperacoesClient } from "@/components/operacoes/operacoes-client";

export const dynamic = "force-dynamic";

export default async function OperacoesPage() {
  const [operacoes, ligas, metodos, times] = await Promise.all([
    getOperacoes(),
    getLigasAtivas(),
    getMetodosAtivos(),
    getTimesAtivos(),
  ]);
  return <OperacoesClient operacoes={operacoes} ligas={ligas} metodos={metodos} times={times} />;
}
