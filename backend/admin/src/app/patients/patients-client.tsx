"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Plus, MoreHorizontal, Trash2, ExternalLink } from "lucide-react";

type Patient = { patient_id: string; workflow_id: string; status: string };

export function PatientsClient({ initialPatients }: { initialPatients: Patient[] }) {
  const router = useRouter();
  const [patients, setPatients] = useState(initialPatients);
  const [createOpen, setCreateOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [form, setForm] = useState({ id: "", display_name: "", language: "nl" });
  const [creating, setCreating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleCreate() {
    setCreating(true);
    try {
      const res = await fetch("/api/patients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(await res.text());
      const created = await res.json();
      setPatients((p) => [
        ...p,
        { patient_id: created.patient_id, workflow_id: created.workflow_id, status: created.status },
      ]);
      setCreateOpen(false);
      setForm({ id: "", display_name: "", language: "nl" });
      toast.success("Patient created");
      router.refresh();
    } catch (e) {
      toast.error(String(e));
    } finally {
      setCreating(false);
    }
  }

  async function handleDelete(id: string) {
    setDeleting(true);
    try {
      const res = await fetch(`/api/patients/${id}`, { method: "DELETE" });
      if (!res.ok && res.status !== 204) throw new Error(await res.text());
      setPatients((p) => p.filter((pt) => pt.patient_id !== id));
      setDeleteTarget(null);
      toast.success("Patient deleted");
    } catch (e) {
      toast.error(String(e));
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Patients</h1>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger render={<Button size="sm" />}>
            <Plus className="h-4 w-4 mr-2" />
            New patient
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create patient</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-2">
              <div className="space-y-1">
                <Label>ID</Label>
                <Input
                  placeholder="e.g. anna"
                  value={form.id}
                  onChange={(e) => setForm((f) => ({ ...f, id: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Display name</Label>
                <Input
                  placeholder="e.g. Anna van der Berg"
                  value={form.display_name}
                  onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
                />
              </div>
              <div className="space-y-1">
                <Label>Language</Label>
                <Input
                  placeholder="nl"
                  value={form.language}
                  onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
                />
              </div>
              <Button onClick={handleCreate} disabled={creating || !form.id} className="w-full">
                {creating ? "Creating…" : "Create"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {patients.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          No patients yet — create one
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Workflow ID</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-16" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {patients.map((p) => (
              <TableRow key={p.patient_id}>
                <TableCell>
                  <Link
                    href={`/patients/${p.patient_id}`}
                    className="font-mono text-sm hover:underline flex items-center gap-1"
                  >
                    {p.patient_id}
                    <ExternalLink className="h-3 w-3 text-muted-foreground" />
                  </Link>
                </TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">
                  {p.workflow_id}
                </TableCell>
                <TableCell>
                  <Badge variant={p.status === "running" ? "default" : "secondary"}>
                    {p.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger render={<Button variant="ghost" size="icon" className="h-8 w-8" />}>
                      <MoreHorizontal className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => setDeleteTarget(p.patient_id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={!!deleteTarget} onOpenChange={(o) => !o && setDeleteTarget(null)}>
        <DialogContent showCloseButton={false}>
          <DialogHeader>
            <DialogTitle>Delete patient?</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This will terminate the Temporal workflow for{" "}
            <span className="font-mono">{deleteTarget}</span>. This cannot be undone.
          </p>
          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              onClick={() => setDeleteTarget(null)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              disabled={deleting}
              onClick={() => deleteTarget && handleDelete(deleteTarget)}
              className="flex-1"
            >
              {deleting ? "Deleting…" : "Delete"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
