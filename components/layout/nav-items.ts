import {
  LayoutDashboard,
  CalendarDays,
  ListOrdered,
  ShieldCheck,
  Target,
  Settings,
  Tags,
  Trophy,
  Users,
} from "lucide-react";

export const NAV_ITEMS = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard },
  { href: "/calendario", label: "Calendário", icon: CalendarDays },
  { href: "/operacoes", label: "Operações", icon: ListOrdered },
  { href: "/metodos", label: "Métodos", icon: Tags },
  { href: "/ligas", label: "Ligas", icon: Trophy },
  { href: "/times", label: "Times", icon: Users },
  { href: "/gestao", label: "Gestão", icon: ShieldCheck },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
] as const;
