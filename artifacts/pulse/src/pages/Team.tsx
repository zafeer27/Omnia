import { useState } from "react";
import AppLayout from "@/components/AppLayout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Users, UserPlus, Briefcase, TrendingUp, CheckCircle, Clock, XCircle } from "lucide-react";

type Department = "Engineering" | "Sales" | "Marketing" | "Customer Success" | "Operations";
type Member = { id: number; name: string; role: string; dept: Department; status: "active" | "onboarding" | "leave"; tenure: string; initials: string; color: string };
type Opening = { id: number; role: string; dept: Department; level: string; status: "sourcing" | "interviewing" | "offer"; candidates: number; days: number };

const MEMBERS: Member[] = [
  { id: 1, name: "Alex Rivera", role: "Head of Engineering", dept: "Engineering", status: "active", tenure: "2.5 yrs", initials: "AR", color: "from-blue-500 to-blue-600" },
  { id: 2, name: "Jamie Chen", role: "Lead Engineer", dept: "Engineering", status: "active", tenure: "1.8 yrs", initials: "JC", color: "from-purple-500 to-purple-600" },
  { id: 3, name: "Sam O'Brien", role: "Sr. Engineer", dept: "Engineering", status: "active", tenure: "1.2 yrs", initials: "SO", color: "from-indigo-500 to-indigo-600" },
  { id: 4, name: "Taylor Kim", role: "Engineer", dept: "Engineering", status: "onboarding", tenure: "3 wks", initials: "TK", color: "from-cyan-500 to-cyan-600" },
  { id: 5, name: "Morgan Lee", role: "VP Sales", dept: "Sales", status: "active", tenure: "1.1 yrs", initials: "ML", color: "from-emerald-500 to-emerald-600" },
  { id: 6, name: "Casey Park", role: "AE", dept: "Sales", status: "active", tenure: "8 mo", initials: "CP", color: "from-green-500 to-green-600" },
  { id: 7, name: "Drew Wilson", role: "Head of Marketing", dept: "Marketing", status: "active", tenure: "1.4 yrs", initials: "DW", color: "from-orange-500 to-orange-600" },
  { id: 8, name: "Jordan Smith", role: "CSM Lead", dept: "Customer Success", status: "active", tenure: "2.1 yrs", initials: "JS", color: "from-rose-500 to-rose-600" },
  { id: 9, name: "Riley Torres", role: "CSM", dept: "Customer Success", status: "leave", tenure: "9 mo", initials: "RT", color: "from-pink-500 to-pink-600" },
  { id: 10, name: "Quinn Adams", role: "Head of Ops", dept: "Operations", status: "active", tenure: "1.7 yrs", initials: "QA", color: "from-amber-500 to-amber-600" },
];

const OPENINGS: Opening[] = [
  { id: 1, role: "Senior Backend Engineer", dept: "Engineering", level: "Senior", status: "interviewing", candidates: 4, days: 23 },
  { id: 2, role: "Full-Stack Engineer", dept: "Engineering", level: "Mid", status: "sourcing", candidates: 12, days: 8 },
  { id: 3, role: "Account Executive", dept: "Sales", level: "Mid", status: "offer", candidates: 1, days: 47 },
  { id: 4, role: "Customer Success Manager", dept: "Customer Success", level: "Mid", status: "sourcing", candidates: 7, days: 14 },
];

const DEPT_COLORS: Record<Department, string> = {
  Engineering: "bg-blue-500/10 text-blue-400",
  Sales: "bg-emerald-500/10 text-emerald-400",
  Marketing: "bg-orange-500/10 text-orange-400",
  "Customer Success": "bg-rose-500/10 text-rose-400",
  Operations: "bg-amber-500/10 text-amber-400",
};

const STATUS_CONFIG = {
  active: { label: "Active", color: "text-green-400", icon: CheckCircle },
  onboarding: { label: "Onboarding", color: "text-blue-400", icon: Clock },
  leave: { label: "On Leave", color: "text-muted-foreground", icon: XCircle },
};

const HIRE_STATUS = {
  sourcing: { label: "Sourcing", color: "bg-blue-500/10 text-blue-400" },
  interviewing: { label: "Interviewing", color: "bg-yellow-500/10 text-yellow-400" },
  offer: { label: "Offer Out", color: "bg-green-500/10 text-green-400" },
};

export default function Team() {
  const [deptFilter, setDeptFilter] = useState<Department | "All">("All");
  const depts: (Department | "All")[] = ["All", "Engineering", "Sales", "Marketing", "Customer Success", "Operations"];

  const filtered = deptFilter === "All" ? MEMBERS : MEMBERS.filter((m) => m.dept === deptFilter);
  const deptCounts: Record<string, number> = {};
  MEMBERS.forEach((m) => { deptCounts[m.dept] = (deptCounts[m.dept] || 0) + 1; });

  return (
    <AppLayout>
      <div className="flex-1 overflow-auto p-6 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold tracking-tight">Team Pulse</h1>
              <p className="text-muted-foreground mt-1">Headcount, performance, and hiring pipeline</p>
            </div>
            <Button className="gap-2"><UserPlus className="h-4 w-4" />Add member</Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Headcount", value: MEMBERS.length, icon: Users, color: "text-blue-400" },
              { label: "Active", value: MEMBERS.filter((m) => m.status === "active").length, icon: CheckCircle, color: "text-green-400" },
              { label: "Onboarding", value: MEMBERS.filter((m) => m.status === "onboarding").length, icon: Clock, color: "text-yellow-400" },
              { label: "Open Roles", value: OPENINGS.length, icon: Briefcase, color: "text-purple-400" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border bg-card p-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">{s.label}</span>
                  <s.icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <div className="text-2xl font-bold mt-1">{s.value}</div>
              </div>
            ))}
          </div>

          {/* Dept breakdown */}
          <div className="rounded-xl border bg-card p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-muted-foreground" />Department Breakdown</h3>
            <div className="space-y-3">
              {Object.entries(deptCounts).map(([dept, count]) => (
                <div key={dept} className="flex items-center gap-3">
                  <span className="text-sm w-40 shrink-0">{dept}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${(count / MEMBERS.length) * 100}%` }} transition={{ duration: 0.6, delay: 0.1 }}
                      className="h-full rounded-full bg-primary" />
                  </div>
                  <span className="text-sm text-muted-foreground w-6">{count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Team list */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">Team Members</h3>
              <div className="flex gap-1 flex-wrap">
                {depts.map((d) => (
                  <button key={d} onClick={() => setDeptFilter(d)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all border ${deptFilter === d ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground hover:text-foreground"}`}>
                    {d}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {filtered.map((member, i) => {
                const sc = STATUS_CONFIG[member.status];
                return (
                  <motion.div key={member.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
                    className="flex items-center gap-3 p-3.5 rounded-xl border bg-card hover:bg-muted/20 transition-colors">
                    <div className={`h-9 w-9 rounded-full bg-gradient-to-br ${member.color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {member.initials}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm truncate">{member.name}</span>
                        <span className={`text-xs flex items-center gap-1 shrink-0 ${sc.color}`}>
                          <sc.icon className="h-3 w-3" />{sc.label}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground truncate">{member.role}</span>
                        <span className={`text-xs px-1.5 py-0.5 rounded-md ${DEPT_COLORS[member.dept]}`}>{member.dept}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">{member.tenure}</span>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Open Roles */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold flex items-center gap-2"><Briefcase className="h-4 w-4 text-muted-foreground" />Open Roles</h3>
            {OPENINGS.map((o) => (
              <div key={o.id} className="flex items-center justify-between p-4 rounded-xl border bg-card">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{o.role}</span>
                    <Badge variant="outline" className="text-xs">{o.level}</Badge>
                    <Badge variant="outline" className={`text-xs ${HIRE_STATUS[o.status].color}`}>{HIRE_STATUS[o.status].label}</Badge>
                  </div>
                  <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                    <span>{o.dept}</span>
                    <span>{o.candidates} candidates</span>
                    <span>Day {o.days}</span>
                  </div>
                </div>
                <Button variant="outline" size="sm" className="text-xs">View</Button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
