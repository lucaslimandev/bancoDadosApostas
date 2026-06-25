import Link from "next/link";
import { LineChart } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export function EmptyDashboard() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-24 gap-4">
      <div className="flex size-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
        <LineChart className="size-6" />
      </div>
      <div>
        <h2 className="text-lg font-semibold">Nenhuma operação registrada ainda</h2>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mt-1">
          Comece registrando sua primeira operação para ver seus KPIs e gráficos de performance aqui.
        </p>
      </div>
      <Link href="/operacoes" className={buttonVariants()}>
        Registrar operação
      </Link>
    </div>
  );
}
