"use client";

import useSWR from "swr";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RefreshCw } from "lucide-react";
import { useState } from "react";

type HealthResponse = {
  status: string;
  services: { temporal: boolean; store: boolean; llm: boolean };
  details: { llm: string };
};

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function HealthPage() {
  const { data, isLoading, mutate } = useSWR<HealthResponse>("/api/health", fetcher);
  const [probing, setProbing] = useState(false);

  async function probeLlm() {
    setProbing(true);
    await fetch("/api/health?probe=llm");
    await mutate();
    setProbing(false);
  }

  const status = (ok: boolean | undefined) =>
    ok == null ? "secondary" : ok ? "default" : "destructive";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">System Health</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => mutate()} disabled={isLoading}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" onClick={probeLlm} disabled={probing}>
            {probing ? "Probing…" : "Probe LLM now"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Temporal</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={status(data?.services.temporal)}>
              {data?.services.temporal ? "OK" : data?.services.temporal === false ? "DOWN" : "—"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Store</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={status(data?.services.store)}>
              {data?.services.store ? "OK" : data?.services.store === false ? "DOWN" : "—"}
            </Badge>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">LLM</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Badge variant={status(data?.services.llm)}>
              {data?.services.llm ? "OK" : data?.services.llm === false ? "DOWN" : "—"}
            </Badge>
            {data?.details.llm && (
              <p className="text-xs text-muted-foreground">{data.details.llm}</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
