"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { salvarMeta } from "@/lib/actions/metas";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn, formatBRLSinal } from "@/lib/utils";
import { Target } from "lucide-react";

export function MetaFormCard({
  mes,
  metaLucro: metaLucroInicial,
  metaOperacoes: metaOperacoesInicial,
  lucroRealizado,
  operacoesRealizadas,
}: {
  mes: string;
  metaLucro: number;
  metaOperacoes: number;
  lucroRealizado: number;
  operacoesRealizadas: number;
}) {
  const router = useRouter();
  const [metaLucro, setMetaLucro] = useState(metaLucroInicial);
  const [metaOperacoes, setMetaOperacoes] = useState(metaOperacoesInicial);
  const [salvando, setSalvando] = useState(false);

  const progressoLucro = metaLucro > 0 ? Math.min(100, Math.max(0, (lucroRealizado / metaLucro) * 100)) : 0;
  const progressoOperacoes = metaOperacoes > 0 ? Math.min(100, (operacoesRealizadas / metaOperacoes) * 100) : 0;

  async function handleSalvar() {
    setSalvando(true);
    try {
      await salvarMeta({ mes, metaLucro, metaOperacoes });
      toast.success("Meta atualizada.");
      router.refresh();
    } catch (e) {
      toast.error("Não foi possível salvar a meta.");
      console.error(e);
    } finally {
      setSalvando(false);
    }
  }

  const dataMes = new Date(`${mes}-01T00:00:00`);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base capitalize">
          <Target className="size-4 text-gold" /> Meta de {format(dataMes, "MMMM 'de' yyyy", { locale: ptBR })}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs">Meta de lucro (R$)</Label>
            <Input type="number" step="10" value={metaLucro} onChange={(e) => setMetaLucro(Number(e.target.value) || 0)} />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Meta de operações</Label>
            <Input
              type="number"
              step="1"
              value={metaOperacoes}
              onChange={(e) => setMetaOperacoes(Number(e.target.value) || 0)}
            />
          </div>
        </div>

        <Button size="sm" onClick={handleSalvar} disabled={salvando}>
          Salvar meta
        </Button>

        <div className="space-y-3 pt-2 border-t">
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Lucro realizado</span>
              <span className={cn("font-medium", lucroRealizado >= 0 ? "text-profit" : "text-loss")}>
                {formatBRLSinal(lucroRealizado)} / {formatBRLSinal(metaLucro)}
              </span>
            </div>
            <Progress value={progressoLucro} className="[&_[data-slot=progress-indicator]]:bg-gold" />
          </div>
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-muted-foreground">Operações realizadas</span>
              <span className="font-medium">
                {operacoesRealizadas} / {metaOperacoes}
              </span>
            </div>
            <Progress value={progressoOperacoes} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
