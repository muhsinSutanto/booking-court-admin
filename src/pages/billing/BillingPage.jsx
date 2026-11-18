import { PageBody, PageHeader, Panel, Stat } from "@/components/common/Blocks";
import { Badge } from "@/components/ui/badge";
import { useClub } from "@/context/ClubContext";
import { formatLongDate, monthPrefix } from "@/lib/dates";
import { formatRupiahFull } from "@/lib/format";
import { isRevenue } from "@/lib/events";

const FEE_RATE = 0.08;

export function BillingPage() {
  const { events, invoices, club } = useClub();
  const month = monthPrefix();
  const gross = events
    .filter((event) => event.date.startsWith(month) && isRevenue(event))
    .reduce((sum, event) => sum + event.price, 0);
  const fee = Math.round(gross * FEE_RATE);
  const net = gross - fee;

  return (
    <PageBody>
      <PageHeader
        title="Tagihan"
        description={`Komisi platform 8% dipotong dari pembayaran yang sudah masuk di ${club.name}.`}
      />
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Kotor bulan berjalan" value={formatRupiahFull(gross)} hint="Hanya yang lunas atau sebagian" />
        <Stat label="Komisi 8%" value={formatRupiahFull(fee)} />
        <Stat label="Bersih untuk venue" value={formatRupiahFull(net)} hint="Belum dicairkan" />
      </div>
      <Panel className="overflow-auto">
        <div className="border-b px-4 py-3">
          <p className="font-medium">Periode sebelumnya</p>
          <p className="text-sm text-muted-foreground">Pencairan yang sudah ditutup. Angka periode berjalan dihitung dari jadwal.</p>
        </div>
        <table className="w-full min-w-[640px] text-sm whitespace-nowrap">
          <thead className="text-left text-xs text-muted-foreground">
            <tr>
              <th className="px-4 py-3 font-medium">Periode</th>
              <th className="px-4 py-3 font-medium">Kotor</th>
              <th className="px-4 py-3 font-medium">Komisi</th>
              <th className="px-4 py-3 font-medium">Bersih</th>
              <th className="px-4 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{invoice.period}</td>
                <td className="px-4 py-3">{formatRupiahFull(invoice.gross)}</td>
                <td className="px-4 py-3">{formatRupiahFull(invoice.fee)}</td>
                <td className="px-4 py-3">{formatRupiahFull(invoice.net)}</td>
                <td className="px-4 py-3">
                  <Badge tone="lime">Dicairkan {formatLongDate(invoice.paidAt)}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>
    </PageBody>
  );
}
