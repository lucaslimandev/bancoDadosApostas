import { getOperacoes } from "@/lib/actions/operacoes";
import { getMetas } from "@/lib/actions/metas";
import { mesKey, metricasPorMes } from "@/lib/calculations";
import { MetaFormCard } from "@/components/metas/meta-form-card";
import { HistoricoMensalChart } from "@/components/charts/historico-mensal-chart";

export const dynamic = "force-dynamic";

export default async function MetasPage() {
  const [operacoes, metas] = await Promise.all([getOperacoes(), getMetas()]);

  const mesAtual = mesKey(new Date());
  const porMes = metricasPorMes(operacoes);
  const metaDoMesAtual = metas.find((m) => m.mes === mesAtual);
  const realizadoMesAtual = porMes.get(mesAtual) ?? { lucro: 0, numOperacoes: 0 };

  const todosOsMeses = Array.from(new Set([...metas.map((m) => m.mes), ...porMes.keys()])).sort();
  const historico = todosOsMeses.map((mes) => ({
    mes,
    lucro: porMes.get(mes)?.lucro ?? 0,
    meta: metas.find((m) => m.mes === mes)?.metaLucroUnidades ?? 0,
  }));

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Metas Mensais</h1>
        <p className="text-sm text-muted-foreground">Defina objetivos e acompanhe sua evolução mês a mês.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <MetaFormCard
          mes={mesAtual}
          metaLucroUnidades={metaDoMesAtual?.metaLucroUnidades ?? 20}
          metaOperacoes={metaDoMesAtual?.metaOperacoes ?? 30}
          lucroRealizado={realizadoMesAtual.lucro}
          operacoesRealizadas={realizadoMesAtual.numOperacoes}
        />
        <HistoricoMensalChart dados={historico} />
      </div>
    </div>
  );
}
