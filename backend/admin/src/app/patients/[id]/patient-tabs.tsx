"use client";

import { useState } from "react";
import { toast } from "sonner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  patientId: string;
  passport: Record<string, unknown> | null;
  hotMoments: Record<string, unknown> | null;
  completeness: Record<string, unknown> | null;
  timeline: Record<string, unknown> | null;
};

type PassportField = { category: string; statement: string; confidence: number; last_confirmed_at: string };

function PassportSection({ data }: { data: Record<string, unknown> }) {
  const fields = (data.fields as PassportField[] | undefined) ?? [];
  const byCategory = fields.reduce<Record<string, PassportField[]>>((acc, f) => {
    (acc[f.category] ??= []).push(f);
    return acc;
  }, {});

  if (fields.length === 0) {
    return <p className="text-sm text-muted-foreground">No passport data yet</p>;
  }

  return (
    <div className="space-y-4">
      {Object.entries(byCategory).map(([cat, items]) => (
        <Card key={cat}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm capitalize">{cat.replace(/_/g, " ")}</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="text-sm border-l-2 border-muted pl-3">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.statement}</ReactMarkdown>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {Math.round(item.confidence * 100)}% · {item.last_confirmed_at}
                  </p>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function HotMomentsSection({ data }: { data: Record<string, unknown> }) {
  const calmers = (data.calmers as string[] | undefined) ?? [];
  const agitators = (data.agitators as string[] | undefined) ?? [];
  const soothingPhrase = data.soothing_phrase as string | undefined;
  const namedContact = data.named_contact as Record<string, string> | undefined;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-green-400">Calmers</h3>
          {calmers.length === 0 && <p className="text-sm text-muted-foreground">None recorded</p>}
          {calmers.map((c, i) => (
            <Card key={i} className="border-green-800">
              <CardContent className="pt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{c}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-red-400">Agitators</h3>
          {agitators.length === 0 && <p className="text-sm text-muted-foreground">None recorded</p>}
          {agitators.map((a, i) => (
            <Card key={i} className="border-red-800">
              <CardContent className="pt-4">
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{a}</ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      {soothingPhrase && (
        <Card className="border-blue-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-blue-400">Soothing phrase</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm dark:prose-invert max-w-none italic">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{soothingPhrase}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
      {namedContact && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Named contact</CardTitle>
          </CardHeader>
          <CardContent className="text-sm space-y-1">
            <p><span className="text-muted-foreground">Name:</span> {namedContact.name}</p>
            <p><span className="text-muted-foreground">Relationship:</span> {namedContact.relationship}</p>
            <p><span className="text-muted-foreground">Phone:</span> {namedContact.phone}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function CompletenessSection({ data }: { data: Record<string, unknown> }) {
  const pzp = (data.pzp_coverage as Record<string, number> | undefined) ?? {};
  const readiness = (data.hot_moment_readiness as Record<string, number | boolean> | undefined) ?? {};
  const overall = typeof data.overall_score === "number" ? data.overall_score : null;

  return (
    <div className="space-y-6">
      {overall !== null && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Overall score</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Progress value={overall * 100} className="h-3" />
            <p className="text-xs text-muted-foreground">{Math.round(overall * 100)}%</p>
          </CardContent>
        </Card>
      )}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-muted-foreground">PZP wedges</h3>
        <div className="grid grid-cols-2 gap-4">
          {Object.entries(pzp).map(([key, val]) => (
            <Card key={key}>
              <CardHeader className="pb-2">
                <CardTitle className="text-xs capitalize">{key.replace(/_/g, " ")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Progress value={val * 100} className="h-2" />
                <p className="text-xs text-muted-foreground">{Math.round(val * 100)}%</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Hot moment readiness</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-2 text-sm">
          {Object.entries(readiness).map(([key, val]) => (
            <div key={key} className="flex justify-between">
              <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
              <span className="font-mono">{String(val)}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

type TimelineEvent = { event_id: string; captured_at: string; kind: string; summary: string; channel: string };

function TimelineSection({ data }: { data: Record<string, unknown> }) {
  const events = (data.events as TimelineEvent[] | undefined) ?? [];
  const sorted = [...events].sort((a, b) => b.captured_at.localeCompare(a.captured_at));

  return (
    <div className="space-y-3">
      {sorted.length === 0 && <p className="text-sm text-muted-foreground">No events yet</p>}
      {sorted.map((e) => (
        <Card key={e.event_id}>
          <CardContent className="pt-4 space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">{e.kind}</Badge>
              <Badge variant="secondary" className="text-xs">{e.channel}</Badge>
              <span className="text-xs text-muted-foreground">{new Date(e.captured_at).toLocaleString()}</span>
            </div>
            <p className="text-sm">{e.summary}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function ContributeTab({ patientId }: { patientId: string }) {
  const [text, setText] = useState("");
  const [channel, setChannel] = useState("web");
  const [attribution, setAttribution] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const body = {
        text,
        channel,
        attribution: attribution ? { name: attribution } : {},
      };
      const res = await fetch(`/api/patients/${patientId}/contributions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Contribution submitted");
      setText("");
      setAttribution("");
    } catch (e) {
      toast.error(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-4 max-w-lg">
      <div className="space-y-1">
        <Label>Text</Label>
        <Textarea
          rows={5}
          placeholder="Enter observation, note, or care episode…"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      </div>
      <div className="space-y-1">
        <Label>Channel</Label>
        <Select value={channel} onValueChange={(v) => v && setChannel(v)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="web">web</SelectItem>
            <SelectItem value="staff">staff</SelectItem>
            <SelectItem value="family">family</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1">
        <Label>Attribution</Label>
        <Input
          placeholder="e.g. Nurse Maria"
          value={attribution}
          onChange={(e) => setAttribution(e.target.value)}
        />
      </div>
      <Button onClick={handleSubmit} disabled={submitting || !text}>
        {submitting ? "Submitting…" : "Submit contribution"}
      </Button>
    </div>
  );
}

type QueryResponse = { answer: string; citations: string[] };

function AskTab({ patientId }: { patientId: string }) {
  const [question, setQuestion] = useState("");
  const [result, setResult] = useState<QueryResponse | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    setLoading(true);
    try {
      const res = await fetch(`/api/patients/${patientId}/query`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(await res.text());
      setResult(await res.json());
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4 max-w-lg">
      <div className="flex gap-2">
        <Input
          placeholder="Ask a question about this patient…"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !loading && question && handleAsk()}
        />
        <Button onClick={handleAsk} disabled={loading || !question}>
          {loading ? "…" : "Ask"}
        </Button>
      </div>
      {result && (
        <Card>
          <CardContent className="pt-4 space-y-3">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{result.answer}</ReactMarkdown>
            </div>
            {result.citations?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {result.citations.map((c, i) => (
                  <Badge key={i} variant="secondary" className="text-xs font-mono">{c}</Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export function PatientTabs({ patientId, passport, hotMoments, completeness, timeline }: Props) {
  return (
    <Tabs defaultValue="passport">
      <TabsList>
        <TabsTrigger value="passport">Passport</TabsTrigger>
        <TabsTrigger value="hot-moments">Hot Moments</TabsTrigger>
        <TabsTrigger value="completeness">Completeness</TabsTrigger>
        <TabsTrigger value="timeline">Timeline</TabsTrigger>
        <TabsTrigger value="contribute">Contribute</TabsTrigger>
        <TabsTrigger value="ask">Ask</TabsTrigger>
      </TabsList>

      <TabsContent value="passport" className="mt-4">
        {passport ? (
          <PassportSection data={passport as Record<string, unknown>} />
        ) : (
          <p className="text-sm text-muted-foreground">No passport data</p>
        )}
      </TabsContent>

      <TabsContent value="hot-moments" className="mt-4">
        {hotMoments ? (
          <HotMomentsSection data={hotMoments as Record<string, unknown>} />
        ) : (
          <p className="text-sm text-muted-foreground">No hot moments data</p>
        )}
      </TabsContent>

      <TabsContent value="completeness" className="mt-4">
        {completeness ? (
          <CompletenessSection data={completeness as Record<string, unknown>} />
        ) : (
          <p className="text-sm text-muted-foreground">No completeness data</p>
        )}
      </TabsContent>

      <TabsContent value="timeline" className="mt-4">
        {timeline ? (
          <TimelineSection data={timeline as Record<string, unknown>} />
        ) : (
          <p className="text-sm text-muted-foreground">No timeline data</p>
        )}
      </TabsContent>

      <TabsContent value="contribute" className="mt-4">
        <ContributeTab patientId={patientId} />
      </TabsContent>

      <TabsContent value="ask" className="mt-4">
        <AskTab patientId={patientId} />
      </TabsContent>
    </Tabs>
  );
}
