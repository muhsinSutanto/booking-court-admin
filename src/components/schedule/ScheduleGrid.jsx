import { useEffect, useRef } from "react";
import { Calendar } from "lucide-react";
import { minutesToTime, timeToMinutes } from "@/lib/dates";
import { TYPE_META } from "@/lib/format";
import { todayISO } from "@/lib/dates";
import { cn } from "@/lib/utils";

const START_HOUR = 7;
const END_HOUR = 23;
const HOUR_PX = 76;

export function ScheduleGrid({ date, courts, club, events, onCreate, onOpen }) {
  const scroller = useRef(null);
  const hours = Array.from({ length: END_HOUR - START_HOUR }, (_, index) => START_HOUR + index);
  const height = hours.length * HOUR_PX;
  const activeCourts = courts.filter((court) => court.active);

  useEffect(() => {
    const node = scroller.current;
    if (!node) return;
    node.scrollTop = 0;
  }, [date]);

  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const showNow = date === todayISO() && nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60;
  const nowTop = ((nowMinutes - START_HOUR * 60) / 60) * HOUR_PX;

  function handleColumnClick(event, court) {
    if (event.target.closest("[data-event]")) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const offset = event.clientY - rect.top;
    const raw = START_HOUR * 60 + Math.floor((offset / HOUR_PX) * 60 / 30) * 30;
    const latest = (club.closeHour - 1) * 60;
    const start = minutesToTime(Math.min(Math.max(raw, club.openHour * 60), latest));
    onCreate({ courtId: court.id, start, date });
  }

  if (!activeCourts.length) {
    return (
      <div className="grid h-full place-items-center text-sm text-muted-foreground">
        Semua lapangan di venue ini nonaktif.
      </div>
    );
  }

  return (
    <div ref={scroller} className="h-full overflow-auto">
      <div className="min-w-max">
        <div className="sticky top-0 z-30 flex border-b bg-white">
          <div className="sticky left-0 z-40 w-16 shrink-0 bg-white" />
          {activeCourts.map((court) => (
            <div key={court.id} className="w-[min(42vw,280px)] min-w-44 shrink-0 border-l px-3 py-3 text-center sm:w-64 sm:min-w-56 lg:w-auto lg:min-w-56 lg:flex-1">
              <p className="text-sm font-semibold">{court.name}</p>
              <p className="text-[11px] text-muted-foreground">{court.type}</p>
            </div>
          ))}
        </div>
        <div className="flex">
          <div className="sticky left-0 z-10 w-16 shrink-0 bg-white">
            {hours.map((hour) => (
              <div key={hour} className="relative border-t border-transparent" style={{ height: HOUR_PX }}>
                <span className="absolute top-1 right-2 text-[11px] text-muted-foreground tabular-nums">
                  {String(hour).padStart(2, "0")}:00
                </span>
              </div>
            ))}
          </div>
          <div className="relative flex min-w-0 flex-1">
            {activeCourts.map((court) => {
              const columnEvents = events.filter((item) => item.courtId === court.id);
              return (
                <div
                  key={court.id}
                  className="relative w-[min(42vw,280px)] min-w-44 shrink-0 border-l sm:w-64 sm:min-w-56 lg:w-auto lg:min-w-56 lg:flex-1"
                  style={{ height }}
                  onClick={(event) => handleColumnClick(event, court)}
                >
                  {hours.map((hour) => {
                    const closed = hour < club.openHour || hour >= club.closeHour;
                    return (
                      <div
                        key={hour}
                        className={cn("border-t border-[#eceae4]", closed && "bg-[#f7f6f1]")}
                        style={{ height: HOUR_PX }}
                      >
                        <div className="h-1/2 border-b border-dashed border-[#f0eee8]" />
                      </div>
                    );
                  })}
                  {columnEvents.map((item) => {
                    const start = timeToMinutes(item.start) - START_HOUR * 60;
                    const duration = timeToMinutes(item.end) - timeToMinutes(item.start);
                    const meta = TYPE_META[item.type] ?? TYPE_META.booking;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        data-event
                        onClick={() => onOpen(item.id)}
                        className={cn(
                          "absolute right-1 left-1 z-10 overflow-hidden rounded-md px-2 py-1 text-left",
                          meta.block,
                        )}
                        style={{
                          top: (start / 60) * HOUR_PX + 3,
                          height: Math.max((duration / 60) * HOUR_PX - 6, 28),
                        }}
                      >
                        <span className="flex items-center gap-1 truncate text-xs font-medium">
                          <Calendar className="size-3 shrink-0" />
                          <span className="truncate">{item.title}</span>
                        </span>
                        <span className="block truncate pl-4 text-[11px]">
                          {item.start}–{item.end}
                        </span>
                      </button>
                    );
                  })}
                </div>
              );
            })}
            {showNow ? (
              <div
                className="pointer-events-none absolute right-0 left-0 z-20"
                style={{ top: nowTop }}
              >
                <div className="h-px bg-ink" />
                <div className="absolute -top-1 -left-1 size-2 rounded-full bg-ink" />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
