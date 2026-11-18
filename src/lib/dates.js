const WEEKDAYS = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
const WEEKDAYS_FULL = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
const MONTHS_FULL = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
export const WEEKDAY_LETTERS = ["M", "S", "S", "R", "K", "J", "S"];

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function parseISODate(iso) {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function todayISO() {
  return toISODate(new Date());
}

export function shiftISO(iso, days) {
  const date = parseISODate(iso);
  date.setDate(date.getDate() + days);
  return toISODate(date);
}

export function formatScheduleDate(iso) {
  const date = parseISODate(iso);
  return `${WEEKDAYS[date.getDay()]}, ${date.getDate()} ${MONTHS[date.getMonth()]}`;
}

export function formatLongDate(iso) {
  const date = parseISODate(iso);
  return `${WEEKDAYS_FULL[date.getDay()]}, ${date.getDate()} ${MONTHS_FULL[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatMonthYear(date) {
  return `${MONTHS_FULL[date.getMonth()]} ${date.getFullYear()}`;
}

export function formatShortDay(iso) {
  const date = parseISODate(iso);
  return `${WEEKDAYS[date.getDay()]} ${date.getDate()}`;
}

export function addMinutes(time, minutes) {
  return minutesToTime(timeToMinutes(time) + Number(minutes));
}

export function timeToMinutes(time) {
  const [hour, minute] = time.split(":").map(Number);
  return hour * 60 + minute;
}

export function minutesToTime(total) {
  const hour = Math.floor(total / 60);
  const minute = total % 60;
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export function formatRange(start, end) {
  return `${start}–${end}`;
}

export function monthPrefix(iso = todayISO()) {
  return iso.slice(0, 7);
}

export { MONTHS_FULL };
