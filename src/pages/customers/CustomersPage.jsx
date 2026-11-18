import { useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { EmptyState, PageBody, PageHeader, Panel, SearchInput } from "@/components/common/Blocks";
import { Sheet } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { useClub } from "@/context/ClubContext";
import { formatLongDate, formatRange } from "@/lib/dates";
import { formatRupiahFull, levelLabel } from "@/lib/format";
import { isRevenue } from "@/lib/events";
import { initials } from "@/lib/utils";

export function CustomersPage() {
  const { customers, events, addCustomer } = useClub();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [form, setForm] = useState({ name: "", phone: "", email: "", level: "3.0" });
  const [error, setError] = useState("");

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return customers
      .map((customer) => {
        const history = events.filter((event) => event.customerId === customer.id && event.status !== "cancelled");
        const spend = history.filter(isRevenue).reduce((sum, event) => sum + event.price, 0);
        const last = history.map((event) => event.date).sort().at(-1);
        return { ...customer, visits: history.length, spend, last };
      })
      .filter((customer) => {
        if (!needle) return true;
        return `${customer.name} ${customer.phone} ${customer.email}`.toLowerCase().includes(needle);
      })
      .sort((a, b) => b.spend - a.spend);
  }, [customers, events, query]);

  const selected = rows.find((customer) => customer.id === selectedId) || customers.find((customer) => customer.id === selectedId);
  const history = events
    .filter((event) => event.customerId === selectedId)
    .sort((a, b) => `${b.date}${b.start}`.localeCompare(`${a.date}${a.start}`));

  function submit(event) {
    event.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) {
      setError("Nama dan telepon wajib diisi.");
      return;
    }
    addCustomer(form);
    setForm({ name: "", phone: "", email: "", level: "3.0" });
    setError("");
    setOpen(false);
  }

  return (
    <PageBody>
      <PageHeader title="Pelanggan" description="Semua pemain. Kunjungan dan pengeluaran mengikuti venue yang sedang dibuka.">
        <SearchInput value={query} onChange={setQuery} placeholder="Cari nama atau telepon" />
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus />
          Pelanggan
        </Button>
      </PageHeader>

      {rows.length === 0 ? (
        <EmptyState title="Tidak ada pelanggan" body="Ubah pencarian atau tambah pelanggan baru." />
      ) : (
        <Panel className="overflow-auto">
          <table className="w-full min-w-[760px] text-sm whitespace-nowrap">
            <thead className="bg-[#f7f6f1] text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Nama</th>
                <th className="px-4 py-3 font-medium">Level</th>
                <th className="px-4 py-3 font-medium">Telepon</th>
                <th className="px-4 py-3 font-medium">Kunjungan</th>
                <th className="px-4 py-3 font-medium">Pengeluaran</th>
                <th className="px-4 py-3 font-medium">Terakhir</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((customer) => (
                <tr
                  key={customer.id}
                  className="cursor-pointer border-t border-border hover:bg-[#fafaf6]"
                  onClick={() => setSelectedId(customer.id)}
                >
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="flex size-8 items-center justify-center rounded-full bg-ink text-[11px] font-medium text-white">
                        {initials(customer.name)}
                      </span>
                      <span>
                        <span className="block font-medium">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.email || "Tanpa email"}</span>
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-3">{levelLabel(customer.level)}</td>
                  <td className="px-4 py-3">{customer.phone}</td>
                  <td className="px-4 py-3">{customer.visits}</td>
                  <td className="px-4 py-3">{formatRupiahFull(customer.spend)}</td>
                  <td className="px-4 py-3">{customer.last ? formatLongDate(customer.last) : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}

      {open ? (
        <Sheet open={open} onOpenChange={setOpen} title="Pelanggan baru" description="Data tersimpan di konsol demo ini.">
          <form className="flex flex-col gap-3" onSubmit={submit}>
            <Field label="Nama">
              <Input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
            </Field>
            <Field label="Telepon">
              <Input value={form.phone} onChange={(event) => setForm({ ...form, phone: event.target.value })} />
            </Field>
            <Field label="Email">
              <Input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
            </Field>
            <Field label="Level">
              <Select value={form.level} onChange={(event) => setForm({ ...form, level: event.target.value })}>
                {["Pemula", "2.0", "2.5", "3.0", "3.5", "4.0"].map((level) => (
                  <option key={level}>{level}</option>
                ))}
              </Select>
            </Field>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
            <Button type="submit">Simpan</Button>
          </form>
        </Sheet>
      ) : null}

      <Sheet
        open={Boolean(selected)}
        onOpenChange={(next) => {
          if (!next) setSelectedId(null);
        }}
        title={selected?.name || "Pelanggan"}
        description={selected ? levelLabel(selected.level) : ""}
      >
        {selected ? (
          <div className="flex flex-col gap-4 text-sm">
            <p>{selected.phone}</p>
            <p className="text-muted-foreground">{selected.email || "Tanpa email"}</p>
            <p className="text-muted-foreground">Bergabung {formatLongDate(selected.since)}</p>
            <div>
              <p className="text-xs font-medium text-muted-foreground">Riwayat di venue ini</p>
              <div className="mt-2 flex flex-col gap-2">
                {history.length === 0 ? (
                  <p className="text-muted-foreground">Belum ada jadwal.</p>
                ) : (
                  history.map((item) => (
                    <div key={item.id} className="rounded-lg bg-[#f7f6f1] px-3 py-2">
                      <p className="font-medium">{item.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatLongDate(item.date)} · {formatRange(item.start, item.end)} · {formatRupiahFull(item.price)}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        ) : null}
      </Sheet>
    </PageBody>
  );
}
