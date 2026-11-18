import { useState } from "react";
import { Plus } from "lucide-react";
import { EmptyState, PageBody, PageHeader, Panel } from "@/components/common/Blocks";
import { EventDialog } from "@/components/schedule/EventDialog";
import { EventSheet } from "@/components/schedule/EventSheet";
import { Button } from "@/components/ui/button";
import { useClub } from "@/context/ClubContext";
import { formatScheduleDate, formatRange } from "@/lib/dates";
import { formatRupiahFull, levelLabel } from "@/lib/format";

export function ClinicsPage() {
  const { events, courts } = useClub();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const clinics = events
    .filter((event) => event.type === "clinic" && event.status !== "cancelled")
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));

  return (
    <PageBody>
      <PageHeader title="Klinik & kelas" description="Sesi coach privat dan grup. Kapasitas mengikuti jumlah pemain.">
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus />
          Kelas
        </Button>
      </PageHeader>
      {clinics.length === 0 ? (
        <EmptyState title="Belum ada kelas" body="Tambah klinik supaya lapangan dan coach terblokir di jadwal." />
      ) : (
        <div className="grid gap-3">
          {clinics.map((clinic) => {
            const court = courts.find((item) => item.id === clinic.courtId);
            const ratio = clinic.spotsTotal ? Math.min(100, Math.round((clinic.spotsTaken / clinic.spotsTotal) * 100)) : 0;
            return (
              <Panel key={clinic.id} className="p-4">
                <button type="button" className="w-full text-left" onClick={() => setActiveId(clinic.id)}>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{clinic.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {clinic.coach || "Coach"} · {levelLabel(clinic.level)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {formatScheduleDate(clinic.date)} · {formatRange(clinic.start, clinic.end)} · {court?.name}
                      </p>
                    </div>
                    <p className="text-sm font-medium">{formatRupiahFull(clinic.price)}</p>
                  </div>
                  <div className="mt-3">
                    <div className="mb-1 flex justify-between text-xs text-muted-foreground">
                      <span>
                        {clinic.spotsTaken}/{clinic.spotsTotal} peserta
                      </span>
                      <span>{ratio}%</span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-secondary">
                      <div className="h-full rounded-full bg-ink" style={{ width: `${ratio}%` }} />
                    </div>
                  </div>
                </button>
              </Panel>
            );
          })}
        </div>
      )}
      <EventDialog open={open} onOpenChange={setOpen} preset={{ type: "clinic", duration: 90 }} />
      <EventSheet eventId={activeId} onOpenChange={setActiveId} />
    </PageBody>
  );
}
