import { getTimes } from "@/lib/actions/times";
import { getLigasAtivas } from "@/lib/actions/ligas";
import { TimesClient } from "@/components/times/times-client";

export const dynamic = "force-dynamic";

export default async function TimesPage() {
  const [times, ligas] = await Promise.all([getTimes(), getLigasAtivas()]);
  return <TimesClient times={times} ligas={ligas} />;
}
