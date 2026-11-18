import { timeToMinutes } from "@/lib/dates";

export function displayStatus(event, now = new Date()) {
  if (event.status === "cancelled") return "cancelled";
  if (event.status === "pending") return "pending";
  const end = new Date(`${event.date}T${event.end}:00`);
  if (end < now) return "completed";
  return "confirmed";
}

export function rangesOverlap(start, end, otherStart, otherEnd) {
  return start < otherEnd && otherStart < end;
}

export function eventMinutes(event) {
  return Math.max(0, timeToMinutes(event.end) - timeToMinutes(event.start));
}

export function isCounted(event) {
  return event.status !== "cancelled";
}

export function isRevenue(event) {
  return isCounted(event) && (event.payment === "paid" || event.payment === "partial");
}
