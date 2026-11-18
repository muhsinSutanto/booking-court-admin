import { useState } from "react";
import { Plus } from "lucide-react";
import { EmptyState, PageBody, PageHeader, Panel, PaymentBadge } from "@/components/common/Blocks";
import { EventDialog } from "@/components/schedule/EventDialog";
import { EventSheet } from "@/components/schedule/EventSheet";
import { Button } from "@/components/ui/button";
import { useClub } from "@/context/ClubContext";
import { formatScheduleDate, formatRange } from "@/lib/dates";
import { formatRupiahFull, levelLabel } from "@/lib/format";
import { initials } from "@/lib/utils";

export function MatchesPage() {
  const { events, courts } = useClub();
  const [open, setOpen] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const matches = events
    .filter((event) => event.type === "match" && event.status !== "cancelled")
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`));

  return (
    <PageBody>
      <PageHeader title="Match" description="Open match dengan slot pemain. Match baru langsung masuk ke jadwal lapangan.">
        <Button type="button" onClick={() => setOpen(true)}>
          <Plus />
          Match
        </Button>
      </PageHeader>
      {matches.length === 0 ? (
        <EmptyState title="Belum ada match" body="Buat open match supaya pemain bisa mengisi slot." />
      ) : (
        <div className="grid gap-3 lg:grid-cols-2">
          {matches.map((match) => {
            const court = courts.find((item) => item.id === match.courtId);
            const seats = Array.from({ length: match.spotsTotal || 4 }, (_, index) => match.players[index]);
            return (
              <Panel key={match.id} className="p-4">
                <button type="button" className="w-full text-left" onClick={() => setActiveId(match.id)}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="font-semibold">{match.title}</p>
                      <p className="mt-1 text-sm text-muted-foreground">
                        {formatScheduleDate(match.date)} · {formatRange(match.start, match.end)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {court?.name} · {levelLabel(match.level)}
                      </p>
                    </div>
                    <PaymentBadge payment={match.payment} />
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    {seats.map((name, index) => (
                      <span
                        key={`${match.id}-${index}`}
                        className={
                          name
                            ? "flex size-9 items-center justify-center rounded-full bg-ink text-[11px] font-medium text-white"
                            : "flex size-9 items-center justify-center rounded-full border border-dashed text-[11px] text-muted-foreground"
                        }
                      >
                        {name ? initials(name) : index + 1}
                      </span>
                    ))}
                    <span className="ml-auto text-sm">{formatRupiahFull(match.price)}</span>
                  </div>
                </button>
              </Panel>
            );
          })}
        </div>
      )}
      <EventDialog open={open} onOpenChange={setOpen} preset={{ type: "match" }} />
      <EventSheet eventId={activeId} onOpenChange={setActiveId} />
    </PageBody>
  );
}
