import { getOperacoes } from "@/lib/actions/operacoes";
import { getConfiguracao } from "@/lib/actions/configuracao";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const [operacoes, configuracao] = await Promise.all([getOperacoes(), getConfiguracao()]);

  return <DashboardClient operacoes={operacoes} configuracao={configuracao} />;
}
