import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Bell, Shield, Palette, User, Building, CreditCard, ChevronRight, Moon, Sun, Monitor, Check } from "lucide-react";

const sections = [
  { id: "profile", label: "Profile", icon: User },
  { id: "company", label: "Company", icon: Building },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "appearance", label: "Appearance", icon: Palette },
  { id: "security", label: "Security", icon: Shield },
  { id: "billing", label: "Billing", icon: CreditCard },
];

const notificationOptions = [
  { id: "weekly_report", label: "Weekly digest", description: "Summary of your key metrics every Monday" },
  { id: "anomaly", label: "Anomaly alerts", description: "When a metric moves more than 20% in 24 hours" },
  { id: "churn_risk", label: "Churn risk alerts", description: "When a customer shows signs of churning" },
  { id: "ai_insights", label: "AI insights", description: "Proactive recommendations from Omnia" },
];

export default function Settings() {
  const [activeSection, setActiveSection] = useState("profile");
  const [notifications, setNotifications] = useState<Record<string, boolean>>({
    weekly_report: true,
    anomaly: true,
    churn_risk: false,
    ai_insights: true,
  });
  const [theme, setTheme] = useState<"light" | "dark" | "system">("light");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleNotification = (id: string) => {
    setNotifications((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
            <p className="text-muted-foreground mt-1">Manage your account and preferences</p>
          </div>

          <div className="flex gap-6">
            <div className="w-48 shrink-0 space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors text-left ${
                    activeSection === section.id
                      ? "bg-sidebar-accent text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                  }`}
                >
                  <section.icon className="h-4 w-4 shrink-0" />
                  {section.label}
                </button>
              ))}
            </div>

            <div className="flex-1 space-y-4">
              {activeSection === "profile" && (
                <motion.div key="profile" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Profile</CardTitle>
                      <CardDescription>Your personal information</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="h-16 w-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-xl font-bold">F</div>
                        <Button variant="outline" size="sm">Change photo</Button>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">First name</label>
                          <input className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" defaultValue="Founder" />
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Last name</label>
                          <input className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" defaultValue="" />
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Email</label>
                        <input className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" defaultValue="founder@company.com" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Role</label>
                        <input className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" defaultValue="CEO & Co-founder" />
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Button onClick={handleSave} className="gap-2">
                          {saved ? <><Check className="h-4 w-4" /> Saved</> : "Save changes"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === "company" && (
                <motion.div key="company" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Company</CardTitle>
                      <CardDescription>Your business details used to personalize AI insights</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Company name</label>
                        <input className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" defaultValue="Acme Inc." />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Industry</label>
                          <select className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                            <option>SaaS</option>
                            <option>eCommerce</option>
                            <option>Marketplace</option>
                            <option>Agency</option>
                            <option>Other</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <label className="text-sm font-medium">Stage</label>
                          <select defaultValue="Series A" className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30">
                            <option>Pre-seed</option>
                            <option>Seed</option>
                            <option>Series A</option>
                            <option>Series B+</option>
                            <option>Bootstrapped</option>
                          </select>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Business context</label>
                        <textarea
                          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
                          rows={3}
                          defaultValue="B2B SaaS platform helping teams collaborate. Current focus is expanding into enterprise."
                        />
                        <p className="text-xs text-muted-foreground">This helps Omnia give you more relevant insights.</p>
                      </div>
                      <div className="pt-2 flex justify-end">
                        <Button onClick={handleSave} className="gap-2">
                          {saved ? <><Check className="h-4 w-4" /> Saved</> : "Save changes"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === "notifications" && (
                <motion.div key="notifications" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Notifications</CardTitle>
                      <CardDescription>Choose what Omnia notifies you about</CardDescription>
                    </CardHeader>
                    <CardContent className="divide-y divide-border">
                      {notificationOptions.map((opt) => (
                        <div key={opt.id} className="flex items-center justify-between py-4 first:pt-0 last:pb-0">
                          <div>
                            <p className="text-sm font-medium">{opt.label}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{opt.description}</p>
                          </div>
                          <button
                            onClick={() => toggleNotification(opt.id)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              notifications[opt.id] ? "bg-primary" : "bg-secondary"
                            }`}
                          >
                            <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${notifications[opt.id] ? "translate-x-6" : "translate-x-1"}`} />
                          </button>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === "appearance" && (
                <motion.div key="appearance" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Appearance</CardTitle>
                      <CardDescription>Customize how Omnia looks</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm font-medium mb-3">Theme</p>
                      <div className="grid grid-cols-3 gap-3">
                        {([
                          { value: "light", label: "Light", icon: Sun },
                          { value: "dark", label: "Dark", icon: Moon },
                          { value: "system", label: "System", icon: Monitor },
                        ] as const).map(({ value, label, icon: Icon }) => (
                          <button
                            key={value}
                            onClick={() => setTheme(value)}
                            className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                              theme === value ? "border-primary bg-primary/5" : "border-border hover:border-border/80"
                            }`}
                          >
                            <Icon className={`h-5 w-5 ${theme === value ? "text-primary" : "text-muted-foreground"}`} />
                            <span className={`text-sm font-medium ${theme === value ? "text-foreground" : "text-muted-foreground"}`}>{label}</span>
                          </button>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === "security" && (
                <motion.div key="security" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Security</CardTitle>
                      <CardDescription>Manage your password and account security</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Current password</label>
                        <input type="password" className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">New password</label>
                        <input type="password" className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-sm font-medium">Confirm new password</label>
                        <input type="password" className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="••••••••" />
                      </div>
                      <div className="pt-2 flex justify-between items-center">
                        <button className="text-sm text-primary hover:underline">Enable two-factor authentication</button>
                        <Button onClick={handleSave} className="gap-2">
                          {saved ? <><Check className="h-4 w-4" /> Saved</> : "Update password"}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}

              {activeSection === "billing" && (
                <motion.div key="billing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Billing</CardTitle>
                      <CardDescription>Your current plan and payment details</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="rounded-xl border border-primary/30 bg-primary/5 p-5 flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold">Pro Plan</span>
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Active</span>
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">$149 / month · Renews June 2, 2026</p>
                        </div>
                        <Button variant="outline" size="sm">Manage plan</Button>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-3">Payment method</p>
                        <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-12 bg-secondary rounded flex items-center justify-center text-xs font-bold">VISA</div>
                            <span className="text-sm">•••• •••• •••• 4242</span>
                          </div>
                          <button className="text-sm text-primary hover:underline">Update</button>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm font-medium mb-3">Recent invoices</p>
                        <div className="space-y-2">
                          {["May 2026", "Apr 2026", "Mar 2026"].map((month, i) => (
                            <div key={month} className="flex items-center justify-between py-2 border-b border-border last:border-0">
                              <span className="text-sm text-muted-foreground">{month}</span>
                              <div className="flex items-center gap-4">
                                <span className="text-sm font-medium">$149.00</span>
                                <button className="text-xs text-primary hover:underline flex items-center gap-1">Download <ChevronRight className="h-3 w-3" /></button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
