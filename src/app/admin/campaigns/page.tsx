"use client";

import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Campaign } from "@/lib/db/schema";

const EMPTY_FORM = {
  name: "",
  discountPercentage: "0",
  isActive: false,
  validUntil: "",
};

export default function CampaignsPage() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Campaign | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/admin/campaigns");
    setCampaigns(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setOpen(true);
  }

  function openEdit(c: Campaign) {
    setEditing(c);
    setForm({
      name: c.name,
      discountPercentage: String(c.discountPercentage),
      isActive: c.isActive,
      validUntil: c.validUntil
        ? new Date(c.validUntil).toISOString().slice(0, 10)
        : "",
    });
    setOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const payload = {
      name: form.name,
      discountPercentage: Number(form.discountPercentage),
      isActive: form.isActive,
      validUntil: form.validUntil || null,
    };

    const url = editing ? `/api/admin/campaigns/${editing.id}` : "/api/admin/campaigns";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      toast.success(editing ? "Campaign updated" : "Campaign created");
      setOpen(false);
      load();
    } else {
      const err = await res.json();
      toast.error(err.error ?? "Something went wrong");
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this campaign?")) return;
    const res = await fetch(`/api/admin/campaigns/${id}`, { method: "DELETE" });
    if (res.ok) {
      toast.success("Campaign deleted");
      load();
    } else {
      toast.error("Failed to delete");
    }
  }

  // Quick toggle active status without opening dialog
  async function toggleActive(c: Campaign) {
    const res = await fetch(`/api/admin/campaigns/${c.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...c, isActive: !c.isActive }),
    });
    if (res.ok) {
      toast.success(c.isActive ? "Campaign deactivated" : "Campaign activated");
      load();
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Campaigns</h1>
          <p className="text-sm text-muted-foreground mt-0.5">{campaigns.length} campaigns</p>
        </div>
        <Button onClick={openAdd} size="sm" className="gap-2">
          <Plus size={14} /> Add Campaign
        </Button>
      </div>

      <div className="border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Valid Until</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {campaigns.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground py-12">
                  No campaigns yet
                </TableCell>
              </TableRow>
            ) : (
              campaigns.map((c) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{c.discountPercentage}% off</Badge>
                  </TableCell>
                  <TableCell className="text-muted-foreground text-sm">
                    {c.validUntil
                      ? new Date(c.validUntil).toLocaleDateString("th-TH")
                      : "No expiry"}
                  </TableCell>
                  <TableCell>
                    <Switch
                      checked={c.isActive}
                      onCheckedChange={() => toggleActive(c)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-2 justify-end">
                      <Button variant="ghost" size="icon" onClick={() => openEdit(c)}>
                        <Pencil size={14} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(c.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Campaign" : "Add Campaign"}</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="camp-name">Name *</Label>
              <Input
                id="camp-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Summer Sale"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="discount">Discount %</Label>
              <Input
                id="discount"
                type="number"
                min={0}
                max={100}
                value={form.discountPercentage}
                onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="valid-until">Valid Until</Label>
              <Input
                id="valid-until"
                type="date"
                value={form.validUntil}
                onChange={(e) => setForm({ ...form, validUntil: e.target.value })}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is-active">Active</Label>
              <Switch
                id="is-active"
                checked={form.isActive}
                onCheckedChange={(v) => setForm({ ...form, isActive: v })}
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Saving..." : editing ? "Update" : "Create"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
