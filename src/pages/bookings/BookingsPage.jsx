import { useMemo, useState } from "react";
import { EmptyState, FilterChips, PageBody, PageHeader, Panel, SearchInput, StatusBadge, TypeBadge } from "@/components/common/Blocks";
import { EventSheet } from "@/components/schedule/EventSheet";
import { useClub } from "@/context/ClubContext";
import { formatScheduleDate, formatRange } from "@/lib/dates";
import { formatRupiahFull } from "@/lib/format";
import { displayStatus } from "@/lib/events";

export function BookingsPage() {
  const { events, courts } = useClub();
  const [type, setType] = useState("all");
  const [status, setStatus] = useState("all");
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState(null);

  const rows = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return events
      .filter((event) => (type === "all" ? true : event.type === type))
      .filter((event) => (status === "all" ? true : displayStatus(event) === status))
      .filter((event) => event.title.toLowerCase().includes(needle))
      .sort((a, b) => `${b.date}${b.start}`.localeCompare(`${a.date}${a.start}`));
  }, [events, query, status, type]);

  return (
    <PageBody>
      <PageHeader title="Booking" description="Semua reservasi lapangan di venue yang sedang dibuka.">
        <SearchInput value={query} onChange={setQuery} placeholder="Cari nama sesi" />
      </PageHeader>
      <FilterChips
        value={type}
        onChange={setType}
        options={[
          { value: "all", label: "Semua jenis" },
          { value: "booking", label: "Booking" },
          { value: "match", label: "Match" },
          { value: "clinic", label: "Klinik" },
          { value: "program", label: "Program" },
          { value: "league", label: "Liga" },
          { value: "block", label: "Blokir" },
        ]}
      />
      <FilterChips
        value={status}
        onChange={setStatus}
        options={[
          { value: "all", label: "Semua status" },
          { value: "confirmed", label: "Terkonfirmasi" },
          { value: "pending", label: "Menunggu" },
          { value: "completed", label: "Selesai" },
          { value: "cancelled", label: "Dibatalkan" },
        ]}
      />

      {rows.length === 0 ? (
        <EmptyState title="Tidak ada booking" body="Coba longgarkan filter, atau buat jadwal dari halaman Jadwal." />
      ) : (
        <Panel className="overflow-auto">
          <table className="w-full min-w-[720px] text-sm whitespace-nowrap">
            <thead className="bg-[#f7f6f1] text-left text-xs text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-medium">Sesi</th>
                <th className="px-4 py-3 font-medium">Jenis</th>
                <th className="px-4 py-3 font-medium">Jadwal</th>
                <th className="px-4 py-3 font-medium">Lapangan</th>
                <th className="px-4 py-3 font-medium">Harga</th>
                <th className="px-4 py-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((event) => {
                const court = courts.find((item) => item.id === event.courtId);
                return (
                  <tr
                    key={event.id}
                    className="cursor-pointer border-t border-border hover:bg-[#fafaf6]"
                    onClick={() => setActiveId(event.id)}
                  >
                    <td className="px-4 py-3 font-medium">{event.title}</td>
                    <td className="px-4 py-3"><TypeBadge type={event.type} /></td>
                    <td className="px-4 py-3">
                      {formatScheduleDate(event.date)} · {formatRange(event.start, event.end)}
                    </td>
                    <td className="px-4 py-3">{court?.name ?? "—"}</td>
                    <td className="px-4 py-3">{event.price ? formatRupiahFull(event.price) : "—"}</td>
                    <td className="px-4 py-3"><StatusBadge event={event} /></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </Panel>
      )}
      <EventSheet eventId={activeId} onOpenChange={setActiveId} />
    </PageBody>
  );
}
