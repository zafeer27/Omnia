import { Link, useLocation } from "wouter";
import { Activity, LayoutDashboard, MessageSquare, PieChart, Puzzle, Settings, User, ListTodo, Bell, Globe, Users, Mail, Target, TrendingUp, Heart } from "lucide-react";
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
    <div className="flex h-[100dvh] w-full bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <div className="w-60 border-r border-border bg-sidebar flex flex-col shrink-0 overflow-y-auto">
        {/* Logo */}
        <div className="px-5 py-5 flex items-center gap-3 shrink-0">
          <div className="h-7 w-7 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
            <Activity className="text-white h-4 w-4" />
          </div>
          <span className="font-semibold text-base tracking-tight">Pulse</span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 pb-4 space-y-4">
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/50">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const active = location === item.href;
                  return (
                    <Link key={item.name} href={item.href}>
                      <div
                        data-testid={`link-${item.name.toLowerCase().replace(/\s+/g, "-")}`}
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer",
                          active
                            ? "bg-sidebar-accent text-sidebar-accent-foreground"
                            : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                        )}
                      >
                        <item.icon className="h-4 w-4 shrink-0" />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User */}
        <div className="px-3 pb-4 shrink-0 border-t border-border pt-3">
          <Link href="/settings">
            <div className="flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-colors cursor-pointer">
              <div className="h-7 w-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold shrink-0">
                F
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-foreground text-xs font-semibold">Founder</div>
                <div className="text-[10px] text-muted-foreground truncate">founder@company.com</div>
              </div>
            </div>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {children}
      </div>
    </div>
  );
}
