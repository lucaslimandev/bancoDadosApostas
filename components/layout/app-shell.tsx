import { SidebarNav } from "@/components/layout/sidebar-nav";
import { MobileNav } from "@/components/layout/mobile-nav";
import { RiskFooter } from "@/components/layout/risk-footer";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <SidebarNav />
      <div className="md:pl-60 flex min-h-screen flex-col">
        <main className="flex-1 px-4 py-6 md:px-8 md:py-8 pb-24 md:pb-8 max-w-[1600px] w-full mx-auto">
          {children}
        </main>
        <div className="hidden md:block px-8 pb-4 max-w-[1600px] w-full mx-auto">
          <RiskFooter />
        </div>
      </div>
      <MobileNav />
    </div>
  );
}
