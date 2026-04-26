import { apiJson } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { PatientTabs } from "./patient-tabs";

type Props = { params: Promise<{ id: string }> };

type PassportField = {
  category: string;
  statement: string;
  confidence: number;
  last_confirmed_at: string;
};

const titleCase = (id: string) =>
  id
    .replace(/-/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());

const stripBold = (s: string) => s.replace(/\*\*(.+?)\*\*/g, "$1");

function buildSummary(passport: Record<string, unknown> | null): string | null {
  const fields = (passport?.fields as PassportField[] | undefined) ?? [];
  const identity = fields
    .filter((f) => f.category === "identity")
    .sort(
      (a, b) =>
        b.confidence - a.confidence ||
        b.last_confirmed_at.localeCompare(a.last_confirmed_at),
    )
    .slice(0, 3);
  if (identity.length === 0) return null;
  return identity.map((f) => stripBold(f.statement)).join(" · ");
}

export default async function PatientPage({ params }: Props) {
  const { id } = await params;

  const [passport, hotMoments, completeness, timeline] = await Promise.allSettled([
    apiJson<Record<string, unknown>>(`/patients/${id}/passport`),
    apiJson<Record<string, unknown>>(`/patients/${id}/hot-moments`),
    apiJson<Record<string, unknown>>(`/patients/${id}/completeness`),
    apiJson<Record<string, unknown>>(`/patients/${id}/timeline`),
  ]);

  const passportValue = passport.status === "fulfilled" ? passport.value : null;
  const summary = buildSummary(passportValue);
  const name = titleCase(id);

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-semibold">{name}</h1>
            <span className="text-xs font-mono text-muted-foreground bg-muted px-2 py-0.5 rounded">
              {id}
            </span>
          </div>
          {summary && <p className="text-sm text-muted-foreground">{summary}</p>}
        </CardContent>
      </Card>
      <PatientTabs
        patientId={id}
        passport={passportValue}
        hotMoments={hotMoments.status === "fulfilled" ? hotMoments.value : null}
        completeness={completeness.status === "fulfilled" ? completeness.value : null}
        timeline={timeline.status === "fulfilled" ? timeline.value : null}
      />
    </div>
  );
}
