import { Link, useLocation } from "wouter";
import { Activity, LayoutDashboard, MessageSquare, PieChart, Puzzle, Settings, ListTodo, Bell, Globe, Users, Mail, Target, TrendingUp, Heart } from "lucide-react";
import { cn } from "@/lib/utils";

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
      { name: "Settings", href: "/settings", icon: Settings },
    ],
  },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden" style={{ background: "hsl(var(--background))", color: "hsl(var(--foreground))" }}>
      {/* Sidebar */}
      <aside className="w-[220px] flex flex-col shrink-0 overflow-y-auto border-r" style={{ borderColor: "hsl(var(--border))", background: "hsl(var(--sidebar))" }}>

        {/* Logo */}
        <div className="px-4 py-5 flex items-center gap-2.5 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-indigo-500 via-blue-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
            <Activity className="text-white h-3.5 w-3.5" />
          </div>
          <span className="font-semibold text-sm tracking-tight" style={{ color: "hsl(var(--foreground))" }}>Pulse</span>
          <span className="ml-auto text-[10px] font-medium px-1.5 py-0.5 rounded-md" style={{ background: "hsl(var(--primary)/0.15)", color: "hsl(var(--primary))" }}>AI</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-3 space-y-5 mt-1">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-[0.1em]" style={{ color: "hsl(var(--muted-foreground)/0.5)" }}>
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = location === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div
                        className={cn(
                          "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-[13px] font-medium transition-all cursor-pointer group",
                          active
                            ? "text-white"
                            : "hover:text-foreground"
                        )}
                        style={active
                          ? {
                              background: "linear-gradient(135deg, hsl(var(--primary)/0.25), hsl(var(--primary)/0.12))",
                              color: "hsl(var(--primary-foreground))",
                              boxShadow: "inset 0 0 0 1px hsl(var(--primary)/0.2)",
                            }
                          : { color: "hsl(var(--muted-foreground))" }
                        }
                      >
                        <item.icon
                          className="h-[15px] w-[15px] shrink-0 transition-colors"
                          style={{ color: active ? "hsl(var(--primary))" : undefined }}
                        />
                        {item.name}
                        {item.name === "Alerts" && (
                          <span className="ml-auto h-4 w-4 rounded-full text-[10px] font-bold flex items-center justify-center"
                            style={{ background: "hsl(0 84% 60% / 0.15)", color: "hsl(0 84% 60%)" }}>
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

        {/* User */}
        <div className="px-3 pb-4 shrink-0 pt-3" style={{ borderTop: "1px solid hsl(var(--border))" }}>
          <Link href="/settings">
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-all cursor-pointer group"
              style={{ color: "hsl(var(--muted-foreground))" }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "hsl(var(--sidebar-accent))")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white text-xs font-bold shrink-0 shadow-sm">
                F
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold" style={{ color: "hsl(var(--foreground))" }}>Founder</div>
                <div className="text-[11px] truncate">founder@company.com</div>
              </div>
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-400 shrink-0" title="Active" />
            </div>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
