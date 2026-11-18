import { useState } from "react";
import { Sheet } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MethodText, PaymentBadge, StatusBadge, TypeBadge } from "@/components/common/Blocks";
import { useClub } from "@/context/ClubContext";
import { formatLongDate, formatRange } from "@/lib/dates";
import { formatRupiahFull, levelLabel } from "@/lib/format";

export function EventSheet({ eventId, onOpenChange }) {
  const { events, courts, customers, patchEvent } = useClub();
  const event = events.find((item) => item.id === eventId);
  const [armCancel, setArmCancel] = useState(false);
  const court = courts.find((item) => item.id === event?.courtId);
  const customer = customers.find((item) => item.id === event?.customerId);
  const open = Boolean(event);

  return (
    <Sheet
      open={open}
      onOpenChange={(next) => {
        if (!next) {
          setArmCancel(false);
          onOpenChange(null);
        }
      }}
      title={event?.title || "Jadwal"}
      description={court ? `${court.name} · ${court.type}` : "Detail jadwal"}
      footer={
        event && event.status !== "cancelled" ? (
          <div className="flex flex-col gap-2">
            {event.payment !== "paid" && event.type !== "block" ? (
              <Button
                type="button"
                onClick={() => patchEvent(event.id, { payment: "paid", status: "confirmed", method: event.method || "cash" })}
              >
                Tandai lunas
              </Button>
            ) : null}
            {armCancel ? (
              <div className="grid grid-cols-2 gap-2">
                <Button type="button" variant="outline" onClick={() => setArmCancel(false)}>
                  Kembali
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  onClick={() => {
                    patchEvent(event.id, { status: "cancelled" });
                    setArmCancel(false);
                    onOpenChange(null);
                  }}
                >
                  Ya, batalkan
                </Button>
              </div>
            ) : (
              <Button type="button" variant="outline" onClick={() => setArmCancel(true)}>
                Batalkan jadwal
              </Button>
            )}
          </div>
        ) : null
      }
    >
      {event ? (
        <div className="flex flex-col gap-4 text-sm">
          <div className="flex flex-wrap gap-2">
            <TypeBadge type={event.type} />
            <StatusBadge event={event} />
            {event.type !== "block" ? <PaymentBadge payment={event.payment} /> : null}
          </div>
          <Detail label="Waktu" value={`${formatLongDate(event.date)} · ${formatRange(event.start, event.end)}`} />
          <Detail label="Lapangan" value={court ? `${court.name} · ${court.type}` : "—"} />
          {customer ? (
            <Detail label="Pelanggan" value={`${customer.name} · ${customer.phone}`} />
          ) : null}
          {event.coach ? <Detail label="Coach" value={event.coach} /> : null}
          {event.level ? <Detail label="Level" value={levelLabel(event.level)} /> : null}
          {event.spotsTotal ? (
            <Detail label="Pemain" value={`${event.spotsTaken}/${event.spotsTotal}${event.players?.length ? ` · ${event.players.join(", ")}` : ""}`} />
          ) : null}
          {event.type !== "block" ? <Detail label="Harga" value={formatRupiahFull(event.price)} /> : null}
          {event.method ? <Detail label="Metode" value={<MethodText method={event.method} />} /> : null}
          {event.notes ? <Detail label="Catatan" value={event.notes} /> : null}
        </div>
      ) : null}
    </Sheet>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="mt-0.5">{value}</p>
    </div>
  );
}
