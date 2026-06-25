import { getOperacoes } from "@/lib/actions/operacoes";
import { getConfiguracao } from "@/lib/actions/configuracao";
import { CalendarioClient } from "@/components/calendario/calendario-client";

export const dynamic = "force-dynamic";

export default async function CalendarioPage() {
  const [operacoes, configuracao] = await Promise.all([getOperacoes(), getConfiguracao()]);
  return <CalendarioClient operacoes={operacoes} configuracao={configuracao} />;
}
