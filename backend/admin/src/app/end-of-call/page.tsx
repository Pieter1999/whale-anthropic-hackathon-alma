"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PhoneOff } from "lucide-react";

type Patient = { patient_id: string; workflow_id: string; status: string };

export default function EndOfCallPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [patientId, setPatientId] = useState("");
  const [transcript, setTranscript] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/patients")
      .then((r) => r.json())
      .then((d) => {
        setPatients(d.patients ?? []);
        if (d.patients?.length > 0) setPatientId(d.patients[0].patient_id);
      })
      .catch(() => {});
  }, []);

  async function handleSubmit() {
    setSubmitting(true);
    try {
      const payload = { message: { transcript } };
      const res = await fetch(`/api/vapi/end-of-call?patient_id=${patientId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(await res.text());
      toast.success("Episode signaled into Temporal");
      setTranscript("");
    } catch (e) {
      toast.error(String(e));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <PhoneOff className="h-6 w-6 text-muted-foreground" />
        <h1 className="text-2xl font-semibold">End-of-Call Webhook</h1>
      </div>

      <Card>
        <CardContent className="pt-5 space-y-4">
          <div className="space-y-1">
            <Label>Patient</Label>
            <Select value={patientId} onValueChange={(v) => v && setPatientId(v)}>
              <SelectTrigger className="w-64">
                <SelectValue placeholder="Select patient…" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((p) => (
                  <SelectItem key={p.patient_id} value={p.patient_id}>
                    {p.patient_id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Transcript</Label>
            <Textarea
              rows={10}
              placeholder="Paste the call transcript here…"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} disabled={submitting || !transcript || !patientId}>
            {submitting ? "Submitting…" : "Submit transcript"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
