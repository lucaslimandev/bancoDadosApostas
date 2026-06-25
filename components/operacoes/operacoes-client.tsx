"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { Operacao } from "@/lib/types";
import type { OperacaoFormValues } from "@/lib/schemas";
import { criarOperacao, atualizarOperacao, excluirOperacao, duplicarOperacao, importarOperacoes } from "@/lib/actions/operacoes";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { OperacaoForm } from "@/components/operacoes/operacao-form";
import { OperacoesTable } from "@/components/operacoes/operacoes-table";
import { exportarOperacoesCSV, exportarOperacoesJSON, importarArquivo } from "@/lib/csv";
import { Download, FileUp, Plus, ChevronDown } from "lucide-react";

export function OperacoesClient({ operacoes }: { operacoes: Operacao[] }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [sheetAberto, setSheetAberto] = useState(false);
  const [editando, setEditando] = useState<Operacao | null>(null);
  const [excluindo, setExcluindo] = useState<Operacao | null>(null);
  const [submitting, setSubmitting] = useState(false);

  function abrirCriacao() {
    setEditando(null);
    setSheetAberto(true);
  }

  function abrirEdicao(op: Operacao) {
    setEditando(op);
    setSheetAberto(true);
  }

  async function handleSubmit(values: OperacaoFormValues) {
    setSubmitting(true);
    try {
      if (editando) {
        await atualizarOperacao(editando.id, values);
        toast.success("Operação atualizada.");
      } else {
        await criarOperacao(values);
        toast.success("Operação registrada.");
      }
      setSheetAberto(false);
      router.refresh();
    } catch (e) {
      toast.error("Não foi possível salvar a operação.");
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDuplicate(op: Operacao) {
    await duplicarOperacao(op.id);
    toast.success("Operação duplicada.");
    router.refresh();
  }

  async function handleDelete() {
    if (!excluindo) return;
    await excluirOperacao(excluindo.id);
    toast.success("Operação excluída.");
    setExcluindo(null);
    router.refresh();
  }

  async function handleImport(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const linhas = await importarArquivo(file);
      await importarOperacoes(linhas);
      toast.success(`${linhas.length} operações importadas.`);
      router.refresh();
    } catch (err) {
      toast.error("Falha ao importar arquivo. Verifique o formato.");
      console.error(err);
    } finally {
      e.target.value = "";
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Operações</h1>
          <p className="text-sm text-muted-foreground">Histórico completo de operações registradas.</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted">
              <Download className="size-3.5" /> Exportar <ChevronDown className="size-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => exportarOperacoesCSV(operacoes)}>CSV</DropdownMenuItem>
              <DropdownMenuItem onClick={() => exportarOperacoesJSON(operacoes)}>JSON</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button variant="outline" size="sm" className="gap-1.5" onClick={() => fileInputRef.current?.click()}>
            <FileUp className="size-3.5" /> Importar
          </Button>
          <input ref={fileInputRef} type="file" accept=".csv,.json" className="hidden" onChange={handleImport} />
          <Button size="sm" className="gap-1.5" onClick={abrirCriacao}>
            <Plus className="size-3.5" /> Nova operação
          </Button>
        </div>
      </div>

      <OperacoesTable
        operacoes={operacoes}
        onEdit={abrirEdicao}
        onDuplicate={handleDuplicate}
        onDelete={(op) => setExcluindo(op)}
      />

      <Sheet open={sheetAberto} onOpenChange={setSheetAberto}>
        <SheetContent side="right" className="overflow-y-auto sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>{editando ? "Editar operação" : "Nova operação"}</SheetTitle>
          </SheetHeader>
          <div className="px-4 pb-4">
            <OperacaoForm
              defaultValues={editando ? toFormValues(editando) : undefined}
              onSubmit={handleSubmit}
              onCancel={() => setSheetAberto(false)}
              submitLabel={editando ? "Salvar alterações" : "Registrar"}
              isSubmitting={submitting}
            />
          </div>
        </SheetContent>
      </Sheet>

      <AlertDialog open={!!excluindo} onOpenChange={(open) => !open && setExcluindo(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir operação?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. A operação será removida permanentemente do seu histórico.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

function toFormValues(op: Operacao): OperacaoFormValues {
  return {
    data: new Date(op.data),
    liga: op.liga,
    timeCasa: op.timeCasa,
    timeFora: op.timeFora,
    mercado: op.mercado,
    metodo: op.metodo,
    tipo: op.tipo,
    momento: op.momento,
    oddEntrada: op.oddEntrada,
    oddSaida: op.oddSaida,
    stake: op.stake,
    responsabilidade: op.responsabilidade,
    resultado: op.resultado,
    lucro: op.lucro,
    observacoes: op.observacoes,
  };
}
