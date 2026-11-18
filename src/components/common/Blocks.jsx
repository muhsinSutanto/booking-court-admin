import { cn } from "cn";
import { METHOD_LABEL, PAYMENT_LABEL, STATUS_LABEL, TYPE_META } from "@/lib/format";
import { displayStatus } from "@/lib/events";

export function PageHeader({ title, description, children }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold tracking-tight">{title}</h1>
        {description ? <p className="mt-0.5 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      <div className="flex w-full flex-wrap items-center gap-2 sm:w-auto">{children}</div>
    </div>
  );
}

export function PageBody({ children, className }) {
  return <div className={cn("flex h-full flex-col gap-4 overflow-auto p-3 sm:p-4", className)}>{children}</div>;
}

export function Panel({ className, children }) {
  return <section className={cn("rounded-xl bg-white ring-1 ring-border", className)}>{children}</section>;
}

export function Stat({ label, value, hint }) {
  return (
    <Panel className="px-4 py-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-1 text-xl font-semibold tracking-tight">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </Panel>
  );
}

export function FilterChips({ value, onChange, options }) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const active = value === option.value;
        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "h-8 rounded-full px-3 text-xs",
              active ? "bg-ink text-white" : "bg-white text-foreground ring-1 ring-border hover:bg-secondary",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function EmptyState({ title, body }) {
  return (
    <Panel className="px-6 py-16 text-center">
      <p className="font-medium">{title}</p>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </Panel>
  );
}

export function TypeBadge({ type }) {
  const meta = TYPE_META[type] ?? TYPE_META.booking;
  return <span className={cn("inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium", meta.chip)}>{meta.label}</span>;
}

export function PaymentBadge({ payment }) {
  const tone =
    payment === "paid" ? "bg-accent text-ink" : payment === "unpaid" ? "bg-[#f4e7c8] text-ink" : payment === "partial" ? "bg-[#e4e8f8] text-ink" : "bg-secondary text-muted-foreground";
  return <span className={cn("inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium", tone)}>{PAYMENT_LABEL[payment] ?? payment}</span>;
}

export function StatusBadge({ event }) {
  const status = typeof event === "string" ? event : displayStatus(event);
  const tone =
    status === "confirmed" ? "bg-accent text-ink" : status === "pending" ? "bg-[#f4e7c8] text-ink" : status === "completed" ? "bg-secondary text-foreground" : "bg-secondary text-muted-foreground";
  return <span className={cn("inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium", tone)}>{STATUS_LABEL[status] ?? status}</span>;
}

export function MethodText({ method }) {
  if (!method) return "—";
  return METHOD_LABEL[method] ?? method;
}

export function SearchInput({ value, onChange, placeholder }) {
  return (
    <input
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="h-9 w-full rounded-full border border-input bg-white px-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-3 focus-visible:ring-ring/15 sm:max-w-xs"
    />
  );
}
