"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Metodo } from "@/lib/types";
import type { MetodoFormValues } from "@/lib/schemas";
import { criarMetodo, atualizarMetodo, alternarAtivoMetodo, contarUsoMetodo, excluirMetodo } from "@/lib/actions/metodos";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { MetodoForm } from "@/components/metodos/metodo-form";
import { DeleteGuardDialog, type OpcaoReatribuicao } from "@/components/catalogos/delete-guard-dialog";
import { Plus, Pencil, Trash2 } from "lucide-react";

type MetodoComContagem = Metodo & { _count: { operacoes: number } };

export function MetodosClient({ metodos }: { metodos: MetodoComContagem[] }) {
  const router = useRouter();
  const [sheetAberto, setSheetAberto] = useState(false);
  const [editando, setEditando] = useState<Metodo | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [excluindo, setExcluindo] = useState<Metodo | null>(null);
  const [usageCount, setUsageCount] = useState<number | null>(null);
  const [excluindoLoading, setExcluindoLoading] = useState(false);

  function abrirCriacao() {
    setEditando(null);
    setSheetAberto(true);
  }

  function abrirEdicao(m: Metodo) {
    setEditando(m);
    setSheetAberto(true);
  }

  async function handleSubmit(values: MetodoFormValues) {
    setSubmitting(true);
    try {
      if (editando) {
        await atualizarMetodo(editando.id, values);
        toast.success("Método atualizado.");
      } else {
        await criarMetodo(values);
        toast.success("Método criado.");
      }
      setSheetAberto(false);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível salvar.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleToggleAtivo(m: Metodo) {
    await alternarAtivoMetodo(m.id);
    router.refresh();
  }

  async function abrirExclusao(m: Metodo) {
    setExcluindo(m);
    const count = await contarUsoMetodo(m.id);
    setUsageCount(count);
  }

  async function handleExcluir(reatribuirParaId?: string) {
    if (!excluindo) return;
    setExcluindoLoading(true);
    try {
      await excluirMetodo(excluindo.id, reatribuirParaId);
      toast.success("Método excluído.");
      setExcluindo(null);
      setUsageCount(null);
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Não foi possível excluir.");
    } finally {
      setExcluindoLoading(false);
    }
  }

  const opcoesReatribuicao: OpcaoReatribuicao[] = metodos
    .filter((m) => m.id !== excluindo?.id)
    .map((m) => ({ id: m.id, nome: m.nome }));

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Métodos</h1>
          <p className="text-sm text-muted-foreground">Cadastro de métodos usados nas operações.</p>
        </div>
        <Button size="sm" className="gap-1.5" onClick={abrirCriacao}>
          <Plus className="size-3.5" /> Novo método
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {metodos.map((m) => (
          <Card key={m.id} className={!m.ativo ? "opacity-60" : undefined}>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-3 rounded-full shrink-0" style={{ background: m.cor }} />
                  <span className="font-medium text-sm">{m.nome}</span>
                </div>
                <Switch checked={m.ativo} onCheckedChange={() => handleToggleAtivo(m)} />
              </div>
              {m.descricao && <p className="text-xs text-muted-foreground line-clamp-2">{m.descricao}</p>}
              <div className="flex items-center justify-between">
                <Badge variant="secondary" className="text-[10px]">
                  {m._count.operacoes} operações
                </Badge>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon-sm" onClick={() => abrirEdicao(m)}>
                    <Pencil className="size-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" onClick={() => abrirExclusao(m)}>
                    <Trash2 className="size-3.5 text-destructive" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
        {metodos.length === 0 && (
          <p className="text-sm text-muted-foreground col-span-full text-center py-12">Nenhum método cadastrado.</p>
        )}
      </div>

      <Sheet open={sheetAberto} onOpenChange={setSheetAberto}>
        <SheetContent side="right">
          <SheetHeader>
            <SheetTitle>{editando ? "Editar método" : "Novo método"}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <MetodoForm
              defaultValues={editando ?? undefined}
              onSubmit={handleSubmit}
              onCancel={() => setSheetAberto(false)}
              submitLabel={editando ? "Salvar alterações" : "Criar"}
              isSubmitting={submitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      <DeleteGuardDialog
        open={!!excluindo}
        onOpenChange={(open) => {
          if (!open) {
            setExcluindo(null);
            setUsageCount(null);
          }
        }}
        itemNome={excluindo?.nome ?? ""}
        entidadeLabel="Este método"
        usageCount={usageCount}
        opcoesReatribuicao={opcoesReatribuicao}
        onConfirm={handleExcluir}
        loading={excluindoLoading}
      />
    </div>
  );
}
