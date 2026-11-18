import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { EmptyState, PageBody, PageHeader, Panel } from "@/components/common/Blocks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Textarea } from "@/components/ui/field";
import { useClub } from "@/context/ClubContext";

const EMPTY = { code: "", title: "", discount: "", detail: "" };

export function RewardsPage() {
  const { offers, addOffer, toggleOffer, removeOffer } = useClub();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [error, setError] = useState("");

  function submit(event) {
    event.preventDefault();
    if (!form.code.trim() || !form.title.trim() || !form.discount.trim()) {
      setError("Kode, nama, dan potongan wajib diisi.");
      return;
    }
    addOffer(form);
    setForm(EMPTY);
    setError("");
    setOpen(false);
  }

  return (
    <PageBody>
      <PageHeader title="Promo" description="Kode dan penawaran yang bisa disebut resepsionis saat membuat booking.">
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus />
          Promo
        </Button>
      </PageHeader>
      {offers.length === 0 ? (
        <EmptyState title="Belum ada promo" body="Buat kode supaya kasir punya acuan diskon." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {offers.map((offer) => (
            <Panel key={offer.id} className="flex flex-col gap-3 p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold">{offer.title}</p>
                  <p className="mt-1 font-mono text-xs tracking-wide text-muted-foreground">{offer.code}</p>
                </div>
                <Badge tone={offer.active ? "lime" : "muted"}>{offer.active ? "Aktif" : "Mati"}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">{offer.detail}</p>
              <div className="mt-auto flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm">
                  <span className="font-medium">{offer.discount}</span>
                  <span className="text-muted-foreground"> · dipakai {offer.used} kali</span>
                </p>
                <div className="flex gap-2">
                  <Button type="button" size="sm" variant="outline" onClick={() => toggleOffer(offer.id)}>
                    {offer.active ? "Matikan" : "Aktifkan"}
                  </Button>
                  <Button type="button" size="icon-sm" variant="ghost" aria-label="Hapus promo" onClick={() => removeOffer(offer.id)}>
                    <Trash2 />
                  </Button>
                </div>
              </div>
            </Panel>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen} title="Promo baru" description="Kode disimpan untuk venue yang sedang dibuka.">
        <form className="flex flex-col gap-3" onSubmit={submit}>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Kode">
              <Input value={form.code} onChange={(event) => setForm({ ...form, code: event.target.value })} placeholder="SORE20" />
            </Field>
            <Field label="Potongan">
              <Input value={form.discount} onChange={(event) => setForm({ ...form, discount: event.target.value })} placeholder="20%" />
            </Field>
          </div>
          <Field label="Nama">
            <Input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} />
          </Field>
          <Field label="Syarat">
            <Textarea value={form.detail} onChange={(event) => setForm({ ...form, detail: event.target.value })} />
          </Field>
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <div className="flex justify-end">
            <Button type="submit">Simpan promo</Button>
          </div>
        </form>
      </Dialog>
    </PageBody>
  );
}
