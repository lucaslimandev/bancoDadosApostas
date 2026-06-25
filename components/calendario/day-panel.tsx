"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import type { Operacao } from "@/lib/types";
import type { OperacaoFormValues } from "@/lib/schemas";
import { criarOperacao } from "@/lib/actions/operacoes";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { OperacaoForm } from "@/components/operacoes/operacao-form";
import { cn, formatU } from "@/lib/utils";
import { Plus, ArrowLeft } from "lucide-react";

export function DayPanel({
  data,
  operacoes,
  onClose,
}: {
  data: Date | null;
  operacoes: Operacao[];
  onClose: () => void;
}) {
  const router = useRouter();
  const [criando, setCriando] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const lucroTotal = operacoes.reduce((acc, o) => acc + o.lucro, 0);
  const greens = operacoes.filter((o) => o.resultado === "Green").length;
  const reds = operacoes.filter((o) => o.resultado === "Red").length;
  const somaStake = operacoes.reduce((acc, o) => acc + o.stake, 0);
  const roiDia = somaStake > 0 ? (lucroTotal / somaStake) * 100 : 0;

  async function handleCreate(values: OperacaoFormValues) {
    setSubmitting(true);
    try {
      await criarOperacao(values);
      toast.success("Operação registrada.");
      setCriando(false);
      router.refresh();
    } catch (e) {
      toast.error("Não foi possível registrar a operação.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Sheet open={!!data} onOpenChange={(open) => !open && onClose()}>
      <SheetContent side="right" className="overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            {criando && (
              <button onClick={() => setCriando(false)} className="text-muted-foreground hover:text-foreground">
                <ArrowLeft className="size-4" />
              </button>
            )}
            {data && format(data, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </SheetTitle>
        </SheetHeader>

        <div className="px-4 pb-4 space-y-4">
          {criando ? (
            <OperacaoForm
              defaultValues={data ? { data } : undefined}
              onSubmit={handleCreate}
              onCancel={() => setCriando(false)}
              submitLabel="Registrar"
              isSubmitting={submitting}
            />
          ) : (
            <>
              <Card>
                <CardContent className="p-4 grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className={cn("text-lg font-semibold", lucroTotal > 0 && "text-profit", lucroTotal < 0 && "text-loss")}>
                      {formatU(lucroTotal, 2)}
                    </p>
                    <p className="text-[11px] text-muted-foreground">Lucro do dia</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">
                      {greens}G / {reds}R
                    </p>
                    <p className="text-[11px] text-muted-foreground">Greens / Reds</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{roiDia.toFixed(1)}%</p>
                    <p className="text-[11px] text-muted-foreground">ROI do dia</p>
                  </div>
                </CardContent>
              </Card>

              <Button size="sm" className="w-full gap-1.5" onClick={() => setCriando(true)}>
                <Plus className="size-3.5" /> Adicionar operação neste dia
              </Button>

              <div className="space-y-2">
                {operacoes.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-8">Nenhuma operação neste dia.</p>
                )}
                {operacoes.map((op) => (
                  <Card key={op.id}>
                    <CardContent className="p-3 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          {op.timeCasa} <span className="text-muted-foreground">x</span> {op.timeFora}
                        </span>
                        <Badge
                          className={cn(
                            op.resultado === "Green" && "bg-profit/15 text-profit border-transparent",
                            op.resultado === "Red" && "bg-loss/15 text-loss border-transparent",
                            op.resultado === "Anulado" && "bg-muted text-muted-foreground border-transparent"
                          )}
                        >
                          {op.resultado}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Badge variant="secondary" className="text-[10px]">{op.tipo}</Badge>
                        <span>{op.liga}</span>
                        <span>·</span>
                        <span>{op.mercado}</span>
                        <span>·</span>
                        <span>{op.metodo}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          Odd {op.oddEntrada}
                          {op.oddSaida ? ` → ${op.oddSaida}` : ""} · Stake {op.stake}u
                        </span>
                        <span className={cn("font-semibold tabular-nums", op.lucro > 0 && "text-profit", op.lucro < 0 && "text-loss")}>
                          {formatU(op.lucro, 2)}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
