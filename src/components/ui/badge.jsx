import { cn } from "cn";

const tones = {
  lime: "bg-accent text-ink",
  ink: "bg-ink text-white",
  sand: "bg-[#f4e7c8] text-ink",
  muted: "bg-secondary text-muted-foreground",
  rose: "bg-[#f8e4ea] text-ink",
};

export function Badge({ tone = "muted", className, ...props }) {
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-full px-2 text-[11px] font-medium whitespace-nowrap",
        tones[tone],
        className,
      )}
      {...props}
    />
  );
}
