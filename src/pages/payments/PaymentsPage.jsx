import { useMemo, useState } from "react";
import { EmptyState, FilterChips, MethodText, PageBody, PageHeader, Panel, PaymentBadge, Stat } from "@/components/common/Blocks";
import { Button } from "@/components/ui/button";
import { useClub } from "@/context/ClubContext";
import { formatScheduleDate, monthPrefix } from "@/lib/dates";
import { formatRupiahFull } from "@/lib/format";

export function PaymentsPage() {
  const { events, patchEvent } = useClub();
  const [filter, setFilter] = useState("all");
  const month = monthPrefix();

  const payable = useMemo(
    () =>
      events.filter(
        (event) =>
          event.type !== "block" &&
          event.price > 0 &&
          (event.status !== "cancelled" || event.payment === "refunded"),
      ),
    [events],
  );

  const rows = payable
    .filter((event) => (filter === "all" ? true : event.payment === filter))
    .sort((a, b) => `${b.date}${b.start}`.localeCompare(`${a.date}${a.start}`));

  const sum = (list) => list.reduce((total, event) => total + event.price, 0);
  const thisMonth = payable.filter((event) => event.date.startsWith(month));
  const paid = thisMonth.filter((event) => event.payment === "paid" || event.payment === "partial");
  const unpaid = payable.filter((event) => event.payment === "unpaid");
  const refunded = events.filter((event) => event.payment === "refunded");

  return (
    <PageBody>
      <PageHeader title="Pembayaran" description="Uang masuk dari booking, match, klinik, program, dan liga." />
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Masuk bulan ini" value={formatRupiahFull(sum(paid))} hint="Lunas dan sebagian" />
        <Stat label="Belum dibayar" value={formatRupiahFull(sum(unpaid))} hint={`${unpaid.length} sesi`} />
        <Stat label="Refund" value={formatRupiahFull(sum(refunded))} hint={`${refunded.length} transaksi`} />
      </div>
      <FilterChips
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "Semua" },
          { value: "paid", label: "Lunas" },
          { value: "unpaid", label: "Belum bayar" },
          { value: "partial", label: "Sebagian" },
          { value: "refunded", label: "Refund" },
        ]}
      />
      {rows.length === 0 ? (
        <EmptyState title="Tidak ada pembayaran" body="Filter ini tidak punya transaksi." />
      ) : (
        <Panel className="overflow-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#f7f6f1] text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Sesi</th>
                <th className="px-4 py-3 font-medium">Tanggal</th>
                <th className="px-4 py-3 font-medium">Metode</th>
                <th className="px-4 py-3 font-medium">Jumlah</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium" />
              </tr>
            </thead>
            <tbody>
              {rows.map((event) => (
                <tr key={event.id} className="border-t border-border">
                  <td className="px-4 py-3 font-medium">{event.title}</td>
                  <td className="px-4 py-3">{formatScheduleDate(event.date)}</td>
                  <td className="px-4 py-3"><MethodText method={event.method} /></td>
                  <td className="px-4 py-3">{formatRupiahFull(event.price)}</td>
                  <td className="px-4 py-3"><PaymentBadge payment={event.payment} /></td>
                  <td className="px-4 py-3 text-right">
                    {event.payment === "unpaid" || event.payment === "partial" ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => patchEvent(event.id, { payment: "paid", status: "confirmed", method: event.method || "cash" })}
                      >
                        Tandai lunas
                      </Button>
                    ) : null}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Panel>
      )}
    </PageBody>
  );
}
