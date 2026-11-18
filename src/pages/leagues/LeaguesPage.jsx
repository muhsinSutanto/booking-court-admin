import { useState } from "react";
import { Plus } from "lucide-react";
import { EmptyState, PageBody, PageHeader, Panel } from "@/components/common/Blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input } from "@/components/ui/field";
import { useClub } from "@/context/ClubContext";

const EMPTY = { name: "", division: "", teams: "", next: "" };

export function LeaguesPage() {
  const { leagues, addLeague } = useClub();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.division.trim()) {
      setError("Nama dan divisi wajib diisi.");
      return;
    }
    addLeague(form);
    setForm(EMPTY);
    setError("");
    setOpen(false);
  }

  return (
    <PageBody>
      <PageHeader title="Liga" description="Kompetisi internal venue. Pertandingan yang sudah diplot ada di jadwal lapangan.">
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus />
          Liga
        </Button>
      </PageHeader>
      {leagues.length === 0 ? (
        <EmptyState title="Belum ada liga" body="Buka pendaftaran untuk musim berikutnya." />
      ) : (
        <div className="grid gap-3 xl:grid-cols-2">
          {leagues.map((league) => (
            <Panel key={league.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{league.name}</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {league.division} · {league.teams} tim · berikutnya {league.next}
                  </p>
                </div>
                <Badge tone={league.status === "Berjalan" ? "lime" : "sand"}>{league.status}</Badge>
              </div>
              {league.standings.length ? (
                <table className="mt-4 w-full text-sm">
                  <thead className="text-left text-xs text-muted-foreground">
                    <tr>
                      <th className="py-1 font-medium">Tim</th>
                      <th className="py-1 font-medium">Main</th>
                      <th className="py-1 font-medium">Poin</th>
                    </tr>
                  </thead>
                  <tbody>
                    {league.standings.map((row) => (
                      <tr key={row.name} className="border-t border-border">
                        <td className="py-2">{row.name}</td>
                        <td className="py-2">{row.played}</td>
                        <td className="py-2 font-medium">{row.points}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="mt-4 text-sm text-muted-foreground">Klasemen belum ada. Pendaftaran masih dibuka.</p>
              )}
            </Panel>
          ))}
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen} title="Liga baru">
        <form className="flex flex-col gap-3" onSubmit={submit}>
          <Field label="Nama">
            <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Divisi">
              <Input value={form.division} onChange={(event) => setForm({ ...form, division: event.target.value })} />
            </Field>
            <Field label="Jumlah tim">
              <Input type="number" value={form.teams} onChange={(event) => setForm({ ...form, teams: event.target.value })} />
            </Field>
          </div>
          <Field label="Pertandingan berikutnya">
            <Input
              value={form.next}
              placeholder="Sabtu · 09:00"
              onChange={(event) => setForm({ ...form, next: event.target.value })}
            />
          </Field>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end">
            <Button type="submit">Buka pendaftaran</Button>
          </div>
        </form>
      </Dialog>
    </PageBody>
  );
}
