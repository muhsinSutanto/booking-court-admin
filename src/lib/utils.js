export { cn } from "cn";

export function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

export function initials(name = "") {
  const parts = name.trim().split(/\s+/).slice(0, 2);
  const value = parts.map((part) => part[0]?.toUpperCase() ?? "").join("");
  return value || "?";
}
