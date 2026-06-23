import { supabase } from "@/lib/supabase";

const DEMO_ALERTS = [
  {
    title: "Failed payment surge",
    description:
      "BuildRight has 3 consecutive failed payments. $6K ARR at risk. Stripe retry scheduled in 24 hours.",
    metric: "Revenue",
    change: "-$6K at risk",
    direction: "down",
    severity: "critical",
    resolved: false,
  },
  {
    title: "API Latency Spike",
    description:
      "Core data ingestion endpoint latency increased by 420ms over the last 2 hours, affecting 14 corporate clients.",
    metric: "Operations",
    change: "+420ms",
    direction: "up",
    severity: "warning",
    resolved: false,
  },
  {
    title: "Usage Anomaly Detected",
    description:
      "Acme Corp active session volume dropped 45% below their 30-day trailing average.",
    metric: "Retention",
    change: "-45% sessions",
    direction: "down",
    severity: "info",
    resolved: false,
  },
];

export async function seedDemoAlertsIfNew(userId: string): Promise<void> {
  const { count, error: countError } = await supabase
    .from("alerts")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId);

  if (countError) return;
  if ((count ?? 0) > 0) return;

  await supabase.from("alerts").insert(
    DEMO_ALERTS.map((alert) => ({ ...alert, user_id: userId }))
  );
}
