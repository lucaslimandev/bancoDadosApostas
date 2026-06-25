"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/layout/nav-items";

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-sidebar text-sidebar-foreground border-t border-sidebar-border grid grid-cols-6">
      {NAV_ITEMS.map((item) => {
        const ativo = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-2 text-[10px] font-medium",
              ativo ? "text-gold" : "text-sidebar-foreground/60"
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
