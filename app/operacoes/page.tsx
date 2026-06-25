import { getOperacoes } from "@/lib/actions/operacoes";
import { OperacoesClient } from "@/components/operacoes/operacoes-client";

export const dynamic = "force-dynamic";

export default async function OperacoesPage() {
  const operacoes = await getOperacoes();
  return <OperacoesClient operacoes={operacoes} />;
}
