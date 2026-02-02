import Link from "next/link";
import { LogoutButton } from "@/components/auth/logout-button";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react"; // Make sure to install lucide-react or use text

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden border-b p-4 flex items-center justify-between bg-white dark:bg-slate-950">
        <div className="font-bold text-xl">UniApply</div>
        <LogoutButton />
      </header>

      <div className="grid lg:grid-cols-5 min-h-screen">
        <aside className="hidden lg:block lg:col-span-1 border-r bg-slate-50/50 dark:bg-slate-900/50 p-6 space-y-6">
          <div className="flex items-center gap-2 font-bold text-xl px-2">
            <span>UniApply</span>
          </div>
          
          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-muted-foreground px-2 mb-2">Platform</h3>
            <Link href="/dashboard" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md bg-secondary/50 text-secondary-foreground hover:bg-secondary/70">
              Dashboard
            </Link>
            <Link href="/exams" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors">
              Browse Exams
            </Link>
            <Link href="/applications" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors">
              My Applications
            </Link>
          </div>

          <div className="space-y-1">
            <h3 className="font-semibold text-sm text-muted-foreground px-2 mb-2">Master Profile</h3>
            <Link href="/profile/personal" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors">
              Personal Details
            </Link>
            <Link href="/profile/academic" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors">
              Academic Records
            </Link>
            <Link href="/profile/documents" className="flex items-center gap-2 px-2 py-1.5 text-sm font-medium rounded-md hover:bg-secondary/50 transition-colors">
              Documents Vault
            </Link>
          </div>

          <div className="pt-6 border-t">
            <LogoutButton />
          </div>
        </aside>
        
        <main className="lg:col-span-4 p-4 lg:p-0">
          {children}
        </main>
      </div>
    </div>
  );
}
