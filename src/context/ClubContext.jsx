import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { createSeed } from "@/data/seed";
import { rangesOverlap } from "@/lib/events";
import { todayISO } from "@/lib/dates";
import { uid } from "@/lib/utils";

const STORAGE_KEY = "sample-admin-club-v1";
const CLUB_KEY = "sample-admin-club-id";

const ClubContext = createContext(null);

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return createSeed();
    const parsed = JSON.parse(raw);
    if (!parsed?.events || !parsed?.clubs || !parsed?.courts) return createSeed();
    return parsed;
  } catch {
    return createSeed();
  }
}

export function ClubProvider({ children }) {
  const [state, setState] = useState(loadState);
  const [clubId, setClubIdState] = useState(() => localStorage.getItem(CLUB_KEY) || "kuta");
  const stateRef = useRef(state);
  const clubIdRef = useRef(clubId);

  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  useEffect(() => {
    clubIdRef.current = clubId;
  }, [clubId]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const api = useMemo(() => {
    function commit(updater) {
      const next = updater(stateRef.current);
      stateRef.current = next;
      setState(next);
      return next;
    }

    function setClubId(id) {
      clubIdRef.current = id;
      localStorage.setItem(CLUB_KEY, id);
      setClubIdState(id);
    }

    function addEvent(input) {
      let message = null;
      commit((current) => {
        const clash = current.events.some(
          (item) =>
            item.status !== "cancelled" &&
            item.courtId === input.courtId &&
            item.date === input.date &&
            rangesOverlap(input.start, input.end, item.start, item.end),
        );
        if (clash) {
          message = "Lapangan sudah terisi di jam itu.";
          return current;
        }

        let customers = current.customers;
        let customerId = input.customerId === "new" ? "" : input.customerId;
        if (input.customerId === "new" && input.customerName) {
          const created = {
            id: uid("cust"),
            name: input.customerName.trim(),
            phone: input.phone?.trim() || "—",
            email: "",
            level: input.level || "—",
            since: todayISO(),
          };
          customers = [created, ...customers];
          customerId = created.id;
        }

        const event = {
          id: uid("evt"),
          clubId: clubIdRef.current,
          courtId: input.courtId,
          date: input.date,
          start: input.start,
          end: input.end,
          type: input.type,
          title: input.title.trim(),
          customerId,
          coach: input.coach || "",
          level: input.level || "",
          spotsTotal: Number(input.spotsTotal) || 0,
          spotsTaken: Number(input.spotsTaken) || 0,
          players: input.players || [],
          price: input.type === "block" ? 0 : Number(input.price) || 0,
          payment: input.type === "block" ? "paid" : input.payment,
          method: input.type === "block" ? "" : input.method,
          status: input.payment === "unpaid" ? "pending" : "confirmed",
          notes: input.notes?.trim() || "",
        };

        return { ...current, customers, events: [...current.events, event] };
      });
      return message;
    }

    function patchEvent(id, patch) {
      commit((current) => ({
        ...current,
        events: current.events.map((item) => (item.id === id ? { ...item, ...patch } : item)),
      }));
    }

    function addCustomer(input) {
      const created = {
        id: uid("cust"),
        name: input.name.trim(),
        phone: input.phone.trim(),
        email: input.email.trim(),
        level: input.level,
        since: todayISO(),
      };
      commit((current) => ({ ...current, customers: [created, ...current.customers] }));
      return created;
    }

    function addOffer(input) {
      commit((current) => ({
        ...current,
        offers: [
          {
            id: uid("offer"),
            clubId: clubIdRef.current,
            code: input.code.trim().toUpperCase(),
            title: input.title.trim(),
            detail: input.detail.trim(),
            discount: input.discount.trim(),
            active: true,
            used: 0,
          },
          ...current.offers,
        ],
      }));
    }

    function toggleOffer(id) {
      commit((current) => ({
        ...current,
        offers: current.offers.map((item) => (item.id === id ? { ...item, active: !item.active } : item)),
      }));
    }

    function removeOffer(id) {
      commit((current) => ({ ...current, offers: current.offers.filter((item) => item.id !== id) }));
    }

    function addProgram(input) {
      commit((current) => ({
        ...current,
        programs: [
          {
            id: uid("prog"),
            clubId: clubIdRef.current,
            name: input.name.trim(),
            schedule: input.schedule.trim(),
            summary: input.summary.trim(),
            price: Number(input.price) || 0,
            members: Number(input.members) || 0,
            active: true,
          },
          ...current.programs,
        ],
      }));
    }

    function toggleProgram(id) {
      commit((current) => ({
        ...current,
        programs: current.programs.map((item) =>
          item.id === id ? { ...item, active: !item.active } : item,
        ),
      }));
    }

    function addLeague(input) {
      commit((current) => ({
        ...current,
        leagues: [
          {
            id: uid("league"),
            clubId: clubIdRef.current,
            name: input.name.trim(),
            division: input.division.trim(),
            status: "Pendaftaran",
            teams: Number(input.teams) || 0,
            next: input.next.trim() || "Belum dijadwalkan",
            standings: [],
          },
          ...current.leagues,
        ],
      }));
    }

    function addProduct(input) {
      commit((current) => ({
        ...current,
        products: [
          ...current.products,
          {
            id: uid("sku"),
            clubId: clubIdRef.current,
            name: input.name.trim(),
            category: input.category.trim(),
            price: Number(input.price) || 0,
            stock: Number(input.stock) || 0,
          },
        ],
      }));
    }

    function adjustStock(id, delta) {
      commit((current) => ({
        ...current,
        products: current.products.map((item) =>
          item.id === id ? { ...item, stock: Math.max(0, item.stock + delta) } : item,
        ),
      }));
    }

    function removeProduct(id) {
      commit((current) => ({
        ...current,
        products: current.products.filter((item) => item.id !== id),
      }));
    }

    function updateClub(patch) {
      commit((current) => ({
        ...current,
        clubs: current.clubs.map((club) =>
          club.id === clubIdRef.current ? { ...club, ...patch } : club,
        ),
      }));
    }

    function addCourt(input) {
      commit((current) => ({
        ...current,
        courts: [
          ...current.courts,
          {
            id: uid("court"),
            clubId: clubIdRef.current,
            name: input.name.trim(),
            type: input.type.trim(),
            price: Number(input.price) || 0,
            active: true,
          },
        ],
      }));
    }

    function toggleCourt(id) {
      commit((current) => ({
        ...current,
        courts: current.courts.map((court) =>
          court.id === id ? { ...court, active: !court.active } : court,
        ),
      }));
    }

    function resetDemo() {
      localStorage.removeItem(STORAGE_KEY);
      const next = createSeed();
      stateRef.current = next;
      setState(next);
    }

    return {
      setClubId,
      addEvent,
      patchEvent,
      addCustomer,
      addOffer,
      toggleOffer,
      removeOffer,
      addProgram,
      toggleProgram,
      addLeague,
      addProduct,
      adjustStock,
      removeProduct,
      updateClub,
      addCourt,
      toggleCourt,
      resetDemo,
    };
  }, []);

  const value = useMemo(() => {
    const club = state.clubs.find((item) => item.id === clubId) ?? state.clubs[0];
    const activeClubId = club?.id;
    return {
      ...api,
      state,
      clubId: activeClubId,
      club,
      clubs: state.clubs,
      courts: state.courts.filter((court) => court.clubId === activeClubId),
      events: state.events.filter((item) => item.clubId === activeClubId),
      customers: state.customers,
      coaches: state.coaches,
      staff: state.staff,
      offers: state.offers.filter((item) => item.clubId === activeClubId),
      programs: state.programs.filter((item) => item.clubId === activeClubId),
      leagues: state.leagues.filter((item) => item.clubId === activeClubId),
      products: state.products.filter((item) => item.clubId === activeClubId),
      invoices: state.invoices.filter((item) => item.clubId === activeClubId),
    };
  }, [api, clubId, state]);

  return <ClubContext.Provider value={value}>{children}</ClubContext.Provider>;
}

export function useClub() {
  const context = useContext(ClubContext);
  if (!context) throw new Error("useClub harus dipakai di dalam ClubProvider");
  return context;
}
