import { useMemo, useState } from "react";
import { useClub } from "@/context/ClubContext";
import { shiftISO, todayISO } from "@/lib/dates";
import { eventMinutes, isCounted } from "@/lib/events";

export function useSchedulePage() {
  const clubApi = useClub();
  const [date, setDate] = useState(todayISO);
  const [query, setQuery] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [preset, setPreset] = useState({});
  const [activeId, setActiveId] = useState(null);

  const dayEvents = useMemo(
    () => clubApi.events.filter((event) => event.date === date && event.status !== "cancelled"),
    [clubApi.events, date],
  );

  const events = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (!needle) return dayEvents;
    return dayEvents.filter((event) => {
      const customer = clubApi.customers.find((item) => item.id === event.customerId);
      const court = clubApi.courts.find((item) => item.id === event.courtId);
      const haystack = [event.title, event.coach, event.level, customer?.name, customer?.phone, court?.name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [clubApi.courts, clubApi.customers, dayEvents, query]);

  const occupancy = useMemo(() => {
    const activeCourts = clubApi.courts.filter((court) => court.active).length || 1;
    const openMinutes = Math.max(1, (clubApi.club.closeHour - clubApi.club.openHour) * 60);
    const used = dayEvents.filter(isCounted).reduce((sum, event) => sum + eventMinutes(event), 0);
    return Math.min(100, Math.round((used / (activeCourts * openMinutes)) * 100));
  }, [clubApi.club, clubApi.courts, dayEvents]);

  function openCreate(partial = {}) {
    setPreset({ date, ...partial });
    setCreateOpen(true);
  }

  return {
    ...clubApi,
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
    goToday() {
      setDate(todayISO());
    },
    shift(days) {
      setDate((current) => shiftISO(current, days));
    },
    resetView() {
      setDate(todayISO());
      setQuery("");
    },
  };
}
