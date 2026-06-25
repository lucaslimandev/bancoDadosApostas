import { getLigas } from "@/lib/actions/ligas";
import { LigasClient } from "@/components/ligas/ligas-client";

export const dynamic = "force-dynamic";

export default async function LigasPage() {
  const ligas = await getLigas();
  return <LigasClient ligas={ligas} />;
}
