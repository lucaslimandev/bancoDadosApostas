import { getMetodos } from "@/lib/actions/metodos";
import { MetodosClient } from "@/components/metodos/metodos-client";

export const dynamic = "force-dynamic";

export default async function MetodosPage() {
  const metodos = await getMetodos();
  return <MetodosClient metodos={metodos} />;
}
