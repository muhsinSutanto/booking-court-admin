import { ChevronLeft, ChevronRight, Plus, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CalendarPopover } from "@/components/schedule/CalendarPopover";
import { EventDialog } from "@/components/schedule/EventDialog";
import { EventSheet } from "@/components/schedule/EventSheet";
import { ScheduleGrid } from "@/components/schedule/ScheduleGrid";
import { useSchedulePage } from "@/pages/schedule/hooks/useSchedulePage";
import { TYPE_META } from "@/lib/format";
import { todayISO } from "@/lib/dates";
import { cn } from "@/lib/utils";

const LEGEND = ["booking", "match", "clinic", "program", "league", "block"];

export function SchedulePage() {
  const {
    date,
    setDate,
    query,
    setQuery,
    createOpen,
    setCreateOpen,
    preset,
    activeId,
    setActiveId,
    events,
    occupancy,
    openCreate,
    goToday,
    shift,
    resetView,
    courts,
    club,
  } = useSchedulePage();

  return (
    <div className="flex h-full flex-col gap-3 p-3">
      <div className="flex flex-col gap-2 lg:flex-row lg:flex-wrap lg:items-center">
        <label className="relative min-w-0 lg:w-64">
          <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Cari di jadwal"
            className="h-9 w-full rounded-full border bg-white pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/15"
          />
        </label>
        <div className="flex flex-wrap items-center gap-1.5 lg:ml-auto">
          <Button
            type="button"
            variant="outline"
            className={cn("rounded-full", date === todayISO() && "bg-accent hover:bg-accent")}
            onClick={goToday}
          >
            Hari ini
          </Button>
          <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => shift(-1)} aria-label="Hari sebelumnya">
            <ChevronLeft />
          </Button>
          <CalendarPopover date={date} onChange={setDate} />
          <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={() => shift(1)} aria-label="Hari berikutnya">
            <ChevronRight />
          </Button>
          <Button type="button" variant="outline" size="icon" className="rounded-full" onClick={resetView} aria-label="Reset tampilan">
            <X />
          </Button>
          <Button type="button" className="ml-1 rounded-full" onClick={() => openCreate()}>
            <Plus />
            Buat
          </Button>
        </div>
      </div>

      <div className="no-scrollbar flex items-center gap-3 overflow-x-auto px-1 text-[11px] whitespace-nowrap text-muted-foreground">
        {LEGEND.map((type) => (
          <span key={type} className="inline-flex items-center gap-1.5">
            <span className={cn("size-2.5 rounded-sm", TYPE_META[type].chip)} />
            {TYPE_META[type].label}
          </span>
        ))}
        <span className="ml-auto">
          {events.length} jadwal · okupansi {occupancy}%
        </span>
      </div>

      <div className="min-h-0 flex-1 overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
        <ScheduleGrid
          date={date}
          courts={courts}
          club={club}
          events={events}
          onCreate={openCreate}
          onOpen={setActiveId}
        />
      </div>

      <EventDialog open={createOpen} onOpenChange={setCreateOpen} preset={preset} />
      <EventSheet eventId={activeId} onOpenChange={setActiveId} />
    </div>
  );
}
