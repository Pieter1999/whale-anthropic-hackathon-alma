"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneCall } from "lucide-react";

type Patient = { patient_id: string; workflow_id: string; status: string };
type Document = { content: string; similarity: number | null; uuid: string };

const EXAMPLES = [
  "Wat kalmeert haar?",
  "What does she eat in the morning?",
  "Who should I call in a crisis?",
];

function titleCase(id: string) {
  return id
    .split(/[-_]+/)
    .filter(Boolean)
    .map((w) => w[0].toUpperCase() + w.slice(1))
    .join(" ");
}

export default function VapiPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState("");
  const [message, setMessage] = useState("");
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(false);
  const [elapsedMs, setElapsedMs] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/patients")
      .then((r) => r.json())
      .then((d: { patients?: Patient[] }) => {
        const list = d.patients ?? [];
        setPatients(list);
        const anna = list.find((p) => p.patient_id.toLowerCase().includes("anna"));
        if (anna) setPatientId(anna.patient_id);
        else if (list.length > 0) setPatientId(list[0].patient_id);
      })
      .catch(() => {});
  }, []);

  async function handleSend() {
    setLoading(true);
    setDocuments([]);
    setElapsedMs(null);
    const start = performance.now();
    try {
      const payload = {
        message: {
          type: "knowledge-base-request",
          messages: [{ role: "user", content: message }],
        },
      };
      const res = await fetch(`/api/vapi/kb?patient_id=${patientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      const data: { documents?: Document[] } = await res.json();
      const docs = data.documents ?? [];
      setDocuments(docs);
      setElapsedMs(Math.round(performance.now() - start));
      if (docs.length === 0) toast.info("No documents returned");
    } catch (e) {
      toast.error(String(e));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PhoneCall className="h-6 w-6 text-primary" />
        <h1 className="text-2xl font-semibold">Vapi Knowledge Base Simulator</h1>
      </div>

      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="pt-5 space-y-4">
          <div className="grid grid-cols-3 gap-4 items-end">
            <div className="space-y-1">
              <Label>Patient</Label>
              <Select value={patientId} onValueChange={(v) => v && setPatientId(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select patient…" />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((p) => (
                    <SelectItem key={p.patient_id} value={p.patient_id}>
                      {titleCase(p.patient_id)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="col-span-2 space-y-2">
              <Label>User message</Label>
              <div className="flex flex-wrap gap-2">
                {EXAMPLES.map((q) => (
                  <Button
                    key={q}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setMessage(q)}
                  >
                    {q}
                  </Button>
                ))}
              </div>
              <div className="flex gap-2">
                <Textarea
                  rows={2}
                  placeholder="e.g. What calms Anna down?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="resize-none"
                />
                <Button
                  onClick={handleSend}
                  disabled={loading || !message || !patientId}
                  className="shrink-0 self-end"
                >
                  {loading ? "Querying…" : "Send"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {loading && (
        <div className="space-y-3">
          {[0, 1, 2].map((i) => (
            <Card key={i}>
              <CardHeader className="pb-2">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="ml-auto h-4 w-16" />
                </div>
                <Skeleton className="mt-2 h-1 w-full" />
              </CardHeader>
              <CardContent className="space-y-2">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-11/12" />
                <Skeleton className="h-3 w-3/4" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!loading && documents.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {documents.length} document{documents.length !== 1 ? "s" : ""} returned
            {elapsedMs != null && ` in ${elapsedMs} ms`}
          </p>
          {documents.map((doc, i) => {
            const sim = typeof doc.similarity === "number" ? doc.similarity : null;
            return (
              <Card key={i}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-mono text-muted-foreground">
                      {doc.uuid}
                    </span>
                    {sim != null && (
                      <Badge variant="outline" className="text-xs ml-auto">
                        {Math.round(sim * 100)}% match
                      </Badge>
                    )}
                  </div>
                  {sim != null && <Progress value={sim * 100} className="h-1 mt-1" />}
                </CardHeader>
                <CardContent>
                  <p className="text-sm whitespace-pre-wrap">{doc.content}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
