import { getConfiguracao } from "@/lib/actions/configuracao";
import { getOperacoes } from "@/lib/actions/operacoes";
import { calcularMetricas } from "@/lib/calculations";
import { ConfiguracaoForm } from "@/components/configuracoes/configuracao-form";
import { DadosActions } from "@/components/configuracoes/dados-actions";

export const dynamic = "force-dynamic";

export default async function ConfiguracoesPage() {
  const [configuracao, operacoes] = await Promise.all([getConfiguracao(), getOperacoes()]);
  const metricas = calcularMetricas(operacoes, configuracao.bancaInicial);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Configurações</h1>
        <p className="text-sm text-muted-foreground">Ajuste os parâmetros da sua banca e gerencie seus dados.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ConfiguracaoForm configuracao={configuracao} bancaAtual={metricas.bancaAtual} />
        <DadosActions />
      </div>
    </div>
  );
}
