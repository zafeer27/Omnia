import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Activity, LayoutDashboard, MessageSquare, PieChart, Puzzle, Settings, ListTodo, Bell, Globe, Users, Mail, Target, TrendingUp, Heart, Sun, Moon, LogOut, CreditCard, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";

type NavItem = { name: string; href: string; icon: React.ElementType };
type NavSection = { label: string; items: NavItem[] };

const NAV_SECTIONS: NavSection[] = [
  {
    label: "Command",
    items: [
      { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { name: "Chat", href: "/chat", icon: MessageSquare },
      { name: "Action Items", href: "/actions", icon: ListTodo },
      { name: "Alerts", href: "/alerts", icon: Bell },
    ],
  },
  {
    label: "Analytics",
    items: [
      { name: "Reports", href: "/reports", icon: PieChart },
      { name: "Forecast", href: "/forecast", icon: TrendingUp },
      { name: "Customers", href: "/customers", icon: Heart },
    ],
  },
  {
    label: "Operations",
    items: [
      { name: "Team", href: "/team", icon: Users },
      { name: "Goals", href: "/goals", icon: Target },
      { name: "Competitors", href: "/competitors", icon: Globe },
    ],
  },
  {
    label: "Updates",
    items: [
      { name: "Investor Updates", href: "/investor-updates", icon: Mail },
    ],
  },
  {
    label: "Settings",
    items: [
      { name: "Integrations", href: "/integrations", icon: Puzzle },
      { name: "Billing", href: "/billing", icon: CreditCard },
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, signOut } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location]);

  const displayEmail = user?.email ?? "founder@company.com";
  const displayName = user?.user_metadata?.full_name as string | undefined;
  const initials = displayName
    ? displayName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
    : displayEmail.charAt(0).toUpperCase();

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-background text-foreground">
      {/* Mobile overlay backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "flex flex-col shrink-0 overflow-y-auto border-r border-border bg-sidebar z-50",
          "lg:static lg:translate-x-0 lg:w-[220px]",
          "fixed top-0 left-0 h-full w-[260px] transition-transform duration-300 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Mobile close button */}
        <div className="lg:hidden absolute top-3 right-3 z-50">
          <button
            onClick={() => setSidebarOpen(false)}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2.5 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Activity className="text-white h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">Omnia</span>
          <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-primary/15 text-primary">AI</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-3 pb-3 space-y-4 mt-1">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground/50">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = location === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div
                        onClick={() => setSidebarOpen(false)}
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer",
                          active
                            ? "text-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
                        )}
                        style={active ? {
                          background: "linear-gradient(135deg, hsl(var(--primary)/0.2), hsl(var(--primary)/0.08))",
                          boxShadow: "inset 0 0 0 1px hsl(var(--primary)/0.18)",
                        } : {}}
                      >
                        <item.icon
                          className="h-[15px] w-[15px] shrink-0 transition-colors"
                          style={{ color: active ? "hsl(var(--primary))" : undefined }}
                        />
                        {item.name}
                        {item.name === "Alerts" && (
                          <span className="ml-auto h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center bg-red-500/15 text-red-400">
                            2
                          </span>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Theme toggle + User */}
        <div className="px-3 pb-4 shrink-0 pt-3 border-t border-border space-y-1">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent transition-all"
          >
            {theme === "dark" ? (
              <>
                <Sun className="h-[15px] w-[15px] shrink-0 text-amber-400" />
                <span>Light mode</span>
              </>
            ) : (
              <>
                <Moon className="h-[15px] w-[15px] shrink-0 text-indigo-400" />
                <span>Dark mode</span>
              </>
            )}
            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono">
              {theme === "dark" ? "☀" : "☾"}
            </span>
          </button>

          {/* User */}
          <Link href="/settings">
            <div
              onClick={() => setSidebarOpen(false)}
              className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all cursor-pointer text-muted-foreground hover:text-foreground hover:bg-sidebar-accent"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold text-foreground truncate">
                  {displayName ?? displayEmail.split("@")[0]}
                </div>
                <div className="text-[11px] truncate">{displayEmail}</div>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" title="Active" />
            </div>
          </Link>

          {/* Sign out */}
          <button
            onClick={signOut}
            className="w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium text-muted-foreground hover:text-red-400 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="h-[15px] w-[15px] shrink-0" />
            <span>Sign out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Mobile header bar */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-border bg-background/80 backdrop-blur-sm z-30 shrink-0">
          <button
            onClick={() => setSidebarOpen(true)}
            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 flex items-center justify-center">
              <Activity className="text-white h-3 w-3" />
            </div>
            <span className="font-semibold text-sm tracking-tight text-foreground">Omnia</span>
          </div>
        </div>

        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse 80% 50% at 70% -10%, hsl(var(--primary)/0.05) 0%, transparent 60%)"
        }} />
        {children}
      </div>
    </div>
  );
}
