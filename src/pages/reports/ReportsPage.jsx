import { useMemo, useState } from "react";
import { FilterChips, PageBody, PageHeader, Panel, Stat } from "@/components/common/Blocks";
import { useClub } from "@/context/ClubContext";
import { formatShortDay, shiftISO, todayISO } from "@/lib/dates";
import { TYPE_META, formatRupiah, formatRupiahFull } from "@/lib/format";
import { eventMinutes, isCounted, isRevenue } from "@/lib/events";
import { cn } from "@/lib/utils";

export function ReportsPage() {
  const { state, clubId, courts } = useClub();
  const [scope, setScope] = useState("club");
  const today = todayISO();

  const events = useMemo(() => {
    const source = scope === "all" ? state.events : state.events.filter((event) => event.clubId === clubId);
    return source.filter((event) => event.status !== "cancelled");
  }, [clubId, scope, state.events]);

  const scopedCourts = scope === "all" ? state.courts.filter((court) => court.active) : courts.filter((court) => court.active);

  const days = Array.from({ length: 7 }, (_, index) => shiftISO(today, index - 6));
  const series = days.map((iso) => ({
    iso,
    label: formatShortDay(iso),
    total: events.filter((event) => event.date === iso && isRevenue(event)).reduce((sum, event) => sum + event.price, 0),
  }));
  const max = Math.max(...series.map((item) => item.total), 1);
  const weekTotal = series.reduce((sum, item) => sum + item.total, 0);

  const occupancy = scopedCourts.map((court) => {
    const used = events
      .filter((event) => event.courtId === court.id && event.date === today && isCounted(event))
      .reduce((sum, event) => sum + eventMinutes(event), 0);
    const club = state.clubs.find((item) => item.id === court.clubId);
    const open = Math.max(1, ((club?.closeHour ?? 23) - (club?.openHour ?? 7)) * 60);
    const label = scope === "all" ? `${court.name} · ${club?.city ?? ""}` : court.name;
    return { id: court.id, name: label, ratio: Math.min(100, Math.round((used / open) * 100)) };
  });

  const mix = ["booking", "match", "clinic", "program", "league"].map((type) => ({
    type,
    count: events.filter((event) => event.type === type && event.date === today).length,
  }));
  const mixTotal = mix.reduce((sum, item) => sum + item.count, 0) || 1;
  let angle = 0;
  const stops = mix.map((item) => {
    const start = angle;
    angle += (item.count / mixTotal) * 360;
    return `${colorFor(item.type)} ${start}deg ${angle}deg`;
  });

  const spenders = Object.values(
    events.filter(isRevenue).reduce((map, event) => {
      if (!event.customerId) return map;
      const customer = state.customers.find((item) => item.id === event.customerId);
      if (!customer) return map;
      const current = map[customer.id] || { id: customer.id, name: customer.name, total: 0, count: 0 };
      current.total += event.price;
      current.count += 1;
      map[customer.id] = current;
      return map;
    }, {}),
  )
    .sort((a, b) => b.total - a.total)
    .slice(0, 5);

  const todayRevenue = events.filter((event) => event.date === today && isRevenue(event)).reduce((sum, event) => sum + event.price, 0);

  return (
    <PageBody>
      <PageHeader title="Laporan" description="Angka dihitung dari jadwal yang tersimpan di konsol.">
        <FilterChips
          value={scope}
          onChange={setScope}
          options={[
            { value: "club", label: "Venue ini" },
            { value: "all", label: "Semua venue" },
          ]}
        />
      </PageHeader>
      <div className="grid gap-3 md:grid-cols-3">
        <Stat label="Pendapatan hari ini" value={formatRupiahFull(todayRevenue)} />
        <Stat label="7 hari terakhir" value={formatRupiahFull(weekTotal)} />
        <Stat label="Sesi hari ini" value={String(mix.reduce((sum, item) => sum + item.count, 0))} hint="Di luar blokir lapangan" />
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.4fr_0.8fr]">
        <Panel className="overflow-x-auto p-4">
          <p className="font-medium">Pendapatan 7 hari</p>
          <div className="mt-4 flex h-48 min-w-[520px] items-end gap-2">
            {series.map((day) => (
              <div key={day.iso} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                <span className="text-[10px] text-muted-foreground">{day.total ? formatRupiah(day.total) : "—"}</span>
                <div
                  className={cn("w-full rounded-t-md", day.iso === today ? "bg-lime" : "bg-ink")}
                  style={{ height: `${Math.max(6, (day.total / max) * 140)}px` }}
                />
                <span className="text-[11px] text-muted-foreground">{day.label}</span>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-4">
          <p className="font-medium">Campuran hari ini</p>
          <div className="mt-4 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
            <div
              className="relative size-28 shrink-0 rounded-full"
              style={{ background: mixTotal && mix.some((item) => item.count) ? `conic-gradient(${stops.join(",")})` : "#eceae3" }}
            >
              <div className="absolute inset-3 rounded-full bg-white" />
            </div>
            <div className="flex flex-col gap-1 text-sm">
              {mix.map((item) => (
                <div key={item.type} className="flex items-center gap-2">
                  <span className={cn("size-2.5 rounded-sm", TYPE_META[item.type].chip)} />
                  <span>{TYPE_META[item.type].label}</span>
                  <span className="text-muted-foreground">{item.count}</span>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </div>

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel className="p-4">
          <p className="font-medium">Okupansi hari ini</p>
          <div className="mt-4 flex flex-col gap-3">
            {occupancy.map((court) => (
              <div key={court.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{court.name}</span>
                  <span>{court.ratio}%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-ink" style={{ width: `${court.ratio}%` }} />
                </div>
              </div>
            ))}
          </div>
        </Panel>
        <Panel className="p-4">
          <p className="font-medium">Pelanggan dengan pengeluaran terbesar</p>
          <div className="mt-3">
            {spenders.length === 0 ? (
              <p className="text-sm text-muted-foreground">Belum ada pembayaran masuk.</p>
            ) : (
              spenders.map((customer, index) => (
                <div key={customer.id} className="flex flex-wrap items-center justify-between gap-1 border-t border-border py-2 text-sm first:border-t-0">
                  <span>
                    <span className="mr-2 text-muted-foreground">{index + 1}</span>
                    {customer.name}
                  </span>
                  <span>
                    {formatRupiahFull(customer.total)}
                    <span className="text-muted-foreground"> · {customer.count} sesi</span>
                  </span>
                </div>
              ))
            )}
          </div>
        </Panel>
      </div>
    </PageBody>
  );
}

function colorFor(type) {
  if (type === "booking") return "#dff6a6";
  if (type === "match") return "#b7dfc8";
  if (type === "clinic") return "#f3ebc4";
  if (type === "program") return "#c9d0ee";
  return "#f3d4dd";
}
