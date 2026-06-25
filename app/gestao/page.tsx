import { getOperacoes } from "@/lib/actions/operacoes";
import { getConfiguracao } from "@/lib/actions/configuracao";
import { calcularMetricas, diaKey } from "@/lib/calculations";
import { StakeCalculator } from "@/components/gestao/stake-calculator";
import { RegrasOuro } from "@/components/gestao/regras-ouro";
import { StopDiarioTracker } from "@/components/gestao/stop-diario-tracker";

export const dynamic = "force-dynamic";

export default async function GestaoPage() {
  const [operacoes, configuracao] = await Promise.all([getOperacoes(), getConfiguracao()]);
  const metricas = calcularMetricas(operacoes, configuracao.bancaInicial);

  const hoje = diaKey(new Date());
  const lucroHoje = operacoes
    .filter((op) => diaKey(new Date(op.data)) === hoje)
    .reduce((acc, op) => acc + op.lucro, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Gestão de Banca & Regras</h1>
        <p className="text-sm text-muted-foreground">Ferramentas de risco e disciplina para operar com consistência.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <StakeCalculator bancaAtualU={metricas.bancaAtual} valorUnidade={configuracao.valorUnidade} />
          <StopDiarioTracker
            lucroHoje={lucroHoje}
            stopLossDiario={configuracao.stopLossDiario}
            stopGainDiario={configuracao.stopGainDiario}
          />
        </div>
        <RegrasOuro />
      </div>
    </div>
  );
}
