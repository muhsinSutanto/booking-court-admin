import { useState } from "react";
import { Plus } from "lucide-react";
import { EmptyState, PageBody, PageHeader, Panel } from "@/components/common/Blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useClub } from "@/context/ClubContext";
import { formatRupiahFull } from "@/lib/format";

const EMPTY = { name: "", schedule: "", summary: "", price: "", members: "" };

export function ProgramsPage() {
  const { programs, addProgram, toggleProgram } = useClub();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.schedule.trim()) {
      setError("Nama dan jadwal rutin wajib diisi.");
      return;
    }
    addProgram(form);
    setForm(EMPTY);
    setError("");
    setOpen(false);
  }

  return (
    <PageBody>
      <PageHeader title="Program" description="Kelas rutin dan paket bulanan. Sesi yang sudah masuk kalender ada di Jadwal.">
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus />
          Program
        </Button>
      </PageHeader>
      {programs.length === 0 ? (
        <EmptyState title="Belum ada program" body="Tambah paket supaya resepsionis punya daftar harga rutin." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-3">
          {programs.map((program) => (
            <Panel key={program.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-2">
                <p className="font-semibold">{program.name}</p>
                <Badge tone={program.active ? "lime" : "muted"}>{program.active ? "Buka" : "Tutup"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{program.summary}</p>
              <p className="text-sm">{program.schedule}</p>
              <div className="mt-auto flex items-end justify-between">
                <div>
                  <p className="text-sm font-medium">{formatRupiahFull(program.price)}</p>
                  <p className="text-xs text-muted-foreground">{program.members} member</p>
                </div>
                <Button type="button" size="sm" variant="outline" onClick={() => toggleProgram(program.id)}>
                  {program.active ? "Tutup" : "Buka"}
                </Button>
              </div>
            </Panel>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen} title="Program baru">
        <form className="flex flex-col gap-3" onSubmit={submit}>
          <Field label="Nama">
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <Field label="Jadwal rutin">
            <Input
              value={form.schedule}
              placeholder="Rabu · 19:00–20:30"
              onChange={(event) => setForm({ ...form, schedule: event.target.value })}
            />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Harga">
              <Input type="number" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} />
            </Field>
            <Field label="Member awal">
              <Input type="number" value={form.members} onChange={(event) => setForm({ ...form, members: event.target.value })} />
            </Field>
          </div>
          <Field label="Ringkasan">
            <Textarea value={form.summary} onChange={(event) => setForm({ ...form, summary: event.target.value })} />
          </Field>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end">
            <Button type="submit">Simpan program</Button>
          </div>
        </form>
      </Dialog>
    </PageBody>
  );
}
