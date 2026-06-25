"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { limparTodosOsDados, restaurarDadosDeExemplo } from "@/lib/actions/configuracao";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Database, RotateCcw, Trash2 } from "lucide-react";

export function DadosActions() {
  const router = useRouter();
  const [carregando, setCarregando] = useState<"limpar" | "restaurar" | null>(null);

  async function handleLimpar() {
    setCarregando("limpar");
    try {
      await limparTodosOsDados();
      toast.success("Todos os dados foram apagados.");
      router.refresh();
    } finally {
      setCarregando(null);
    }
  }

  async function handleRestaurar() {
    setCarregando("restaurar");
    try {
      await restaurarDadosDeExemplo();
      toast.success("Dados de exemplo restaurados.");
      router.refresh();
    } finally {
      setCarregando(null);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <Database className="size-4 text-gold" /> Dados
        </CardTitle>
        <CardDescription>Gerencie os dados armazenados localmente no seu banco SQLite.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-wrap gap-2">
        <AlertDialog>
          <AlertDialogTrigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-border bg-background px-2.5 text-sm font-medium hover:bg-muted">
            <RotateCcw className="size-3.5" /> Restaurar dados de exemplo
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Restaurar dados de exemplo?</AlertDialogTitle>
              <AlertDialogDescription>
                Isso substituirá todas as operações atuais por um conjunto de operações de exemplo.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction onClick={handleRestaurar} disabled={carregando === "restaurar"}>
                Restaurar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <AlertDialog>
          <AlertDialogTrigger className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/10 text-destructive px-2.5 text-sm font-medium hover:bg-destructive/20">
            <Trash2 className="size-3.5" /> Limpar todos os dados
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Apagar todos os dados?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta ação é irreversível. Todas as operações e metas serão excluídas permanentemente.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleLimpar}
                disabled={carregando === "limpar"}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Apagar tudo
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
}
