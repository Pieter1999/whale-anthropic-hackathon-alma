import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { apiJson } from "@/lib/api";
import { Users, PhoneCall, PhoneOff, Activity, ArrowUpRight, ExternalLink } from "lucide-react";

type Patient = { patient_id: string; workflow_id: string; status: string };
type Health = { status: string; services: { temporal: boolean; store: boolean; llm: boolean } };

const capabilities = [
  {
    href: "/patients",
    icon: Users,
    title: "Patients",
    description: "10+ seeded personas with rich life context",
  },
  {
    href: "/vapi",
    icon: PhoneCall,
    title: "Voice query",
    description: "Simulate a Vapi knowledge-base call",
  },
  {
    href: "/end-of-call",
    icon: PhoneOff,
    title: "End-of-call ingest",
    description: "Feed transcripts back into the workflow",
  },
];

const secondary = [
  { href: "/health", label: "Health status", external: false },
  { href: "http://localhost:8233", label: "Temporal UI", external: true },
  { href: "http://localhost:8000/docs", label: "API docs", external: true },
];

export default async function Home() {
  const [patientsRes, healthRes] = await Promise.allSettled([
    apiJson<{ patients: Patient[] }>("/patients"),
    apiJson<Health>("/health"),
  ]);

  const patientCount =
    patientsRes.status === "fulfilled" ? patientsRes.value.patients.length : null;
  const health = healthRes.status === "fulfilled" ? healthRes.value : null;

  const statusVariant = (ok: boolean | undefined) =>
    ok == null ? "secondary" : ok ? "default" : "destructive";

  return (
    <div className="mx-auto max-w-4xl space-y-10 py-8">
      <header className="space-y-3">
        <h1 className="text-4xl font-semibold tracking-tight">Care Passport</h1>
        <p className="text-lg text-muted-foreground max-w-2xl">
          An evidence-backed personhood layer for frail elders.
        </p>
      </header>

      <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/50 px-4 py-3 text-sm">
        <span className="text-muted-foreground">Patients</span>
        <span className="font-mono font-medium">
          {patientCount ?? <span className="text-muted-foreground">n/a</span>}
        </span>
        <span className="text-border">|</span>
        <span className="text-muted-foreground">Temporal</span>
        <Badge variant={statusVariant(health?.services.temporal)}>
          {health?.services.temporal ? "OK" : health?.services.temporal === false ? "DOWN" : "n/a"}
        </Badge>
        <span className="text-border">|</span>
        <span className="text-muted-foreground">LLM</span>
        <Badge variant={statusVariant(health?.services.llm)}>
          {health?.services.llm ? "OK" : health?.services.llm === false ? "DOWN" : "n/a"}
        </Badge>
      </div>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {capabilities.map(({ href, icon: Icon, title, description }) => (
          <Link key={href} href={href} className="group">
            <Card className="h-full transition-colors hover:bg-accent/40">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="rounded-md bg-primary/10 p-2 text-primary">
                    <Icon className="h-5 w-5" />
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                </div>
                <CardTitle className="mt-2">{title}</CardTitle>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </section>

      <footer className="flex flex-wrap gap-x-6 gap-y-2 border-t border-border pt-6 text-sm text-muted-foreground">
        {secondary.map(({ href, label, external }) =>
          external ? (
            <a
              key={href}
              href={href}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              {label}
              <ExternalLink className="h-3 w-3" />
            </a>
          ) : (
            <Link
              key={href}
              href={href}
              className="inline-flex items-center gap-1 hover:text-foreground"
            >
              {label}
              <Activity className="h-3 w-3" />
            </Link>
          )
        )}
      </footer>
    </div>
  );
}
