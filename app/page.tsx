import { getOperacoes } from "@/lib/actions/operacoes";
import { getConfiguracao } from "@/lib/actions/configuracao";
import { getLigasAtivas } from "@/lib/actions/ligas";
import { getMetodosAtivos } from "@/lib/actions/metodos";
import { getTimesAtivos } from "@/lib/actions/times";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [operacoes, configuracao, ligas, metodos, times] = await Promise.all([
    getOperacoes(),
    getConfiguracao(),
    getLigasAtivas(),
    getMetodosAtivos(),
    getTimesAtivos(),
  ]);

  return <DashboardClient operacoes={operacoes} configuracao={configuracao} ligas={ligas} metodos={metodos} times={times} />;
}
