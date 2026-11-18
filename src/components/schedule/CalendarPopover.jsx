import { useState } from "react";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { Popover } from "radix-ui";
import { formatMonthYear, formatScheduleDate, parseISODate, todayISO, toISODate, WEEKDAY_LETTERS } from "@/lib/dates";
import { cn } from "@/lib/utils";

export function CalendarPopover({ date, onChange }) {
  const [cursor, setCursor] = useState(() => parseISODate(date));
  const [trackedDate, setTrackedDate] = useState(date);
  if (trackedDate !== date) {
    setTrackedDate(date);
    setCursor(parseISODate(date));
  }

  const year = cursor.getFullYear();
  const month = cursor.getMonth();
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [...Array(firstWeekday).fill(null), ...Array.from({ length: daysInMonth }, (_, index) => index + 1)];
  const today = todayISO();

  return (
    <Popover.Root>
      <Popover.Trigger className="inline-flex h-9 items-center gap-2 rounded-full border bg-white px-3 text-sm outline-none hover:bg-secondary">
        <Calendar className="size-4" />
        {formatScheduleDate(date)}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          align="center"
          sideOffset={8}
          className="z-50 w-[min(280px,calc(100vw-1.5rem))] rounded-2xl bg-white p-3 shadow-xl ring-1 ring-border outline-none"
        >
          <div className="mb-2 flex items-center justify-between px-1">
            <IconButton label="Bulan sebelumnya" onClick={() => setCursor(new Date(year, month - 1, 1))}>
              <ChevronLeft className="size-4" />
            </IconButton>
            <p className="text-sm font-medium">{formatMonthYear(cursor)}</p>
            <IconButton label="Bulan berikutnya" onClick={() => setCursor(new Date(year, month + 1, 1))}>
              <ChevronRight className="size-4" />
            </IconButton>
          </div>
          <div className="grid grid-cols-7 text-center text-[11px] text-muted-foreground">
            {WEEKDAY_LETTERS.map((letter, index) => (
              <div key={`${letter}-${index}`} className="py-1">
                {letter}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((day, index) => {
              if (!day) return <div key={`empty-${index}`} />;
              const iso = toISODate(new Date(year, month, day));
              const active = iso === date;
              return (
                <Popover.Close key={iso} asChild>
                  <button
                    type="button"
                    onClick={() => onChange(iso)}
                    className={cn(
                      "mx-auto flex size-8 items-center justify-center rounded-full text-sm",
                      active && "bg-ink text-white",
                      !active && iso === today && "ring-1 ring-ink",
                      !active && "hover:bg-secondary",
                    )}
                  >
                    {day}
                  </button>
                </Popover.Close>
              );
            })}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}

function IconButton({ label, children, onClick }) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-7 items-center justify-center rounded-full text-muted-foreground hover:bg-secondary hover:text-foreground"
    >
      {children}
    </button>
  );
}
