import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Field, Input, Select, Textarea } from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useClub } from "@/context/ClubContext";
import { addMinutes, timeToMinutes, todayISO } from "@/lib/dates";
import { TYPE_META, priceForDuration } from "@/lib/format";
import { cn } from "@/lib/utils";

const TYPES = ["booking", "match", "clinic", "program", "league", "block"];

function initialForm(preset, courts, club) {
  const active = courts.filter((court) => court.active);
  const courtId = preset.courtId || active[0]?.id || "";
  const duration = preset.duration || 60;
  const court = courts.find((item) => item.id === courtId);
  return {
    type: preset.type || "booking",
    courtId,
    date: preset.date || todayISO(),
    start: preset.start || `${String(club.openHour).padStart(2, "0")}:00`,
    duration,
    customerId: "",
    customerName: "",
    phone: "",
    title: "",
    coach: "Coach Marcos",
    level: "3.0+",
    spotsTotal: preset.type === "clinic" ? 6 : 4,
    price: court ? priceForDuration(court.price, duration) : 0,
    priceTouched: false,
    payment: "unpaid",
    method: "qris",
    notes: "",
  };
}

export function EventDialog({ open, onOpenChange, preset = {} }) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Buat jadwal"
      description="Isi lapangan dan jam. Sistem menolak jadwal yang bentrok."
    >
      {open ? <EventForm preset={preset} onClose={() => onOpenChange(false)} /> : null}
    </Dialog>
  );
}

function EventForm({ preset, onClose }) {
  const { courts, club, customers, coaches, addEvent } = useClub();
  const [form, setForm] = useState(() => initialForm(preset, courts, club));
  const [error, setError] = useState("");

  function update(patch) {
    setForm((current) => {
      const next = { ...current, ...patch };
      if (!next.priceTouched && (patch.courtId || patch.duration || patch.type)) {
        const court = courts.find((item) => item.id === next.courtId);
        next.price = next.type === "block" || !court ? 0 : priceForDuration(court.price, Number(next.duration));
      }
      return next;
    });
  }

  const starts = [];
  for (let minute = club.openHour * 60; minute < club.closeHour * 60; minute += 30) {
    const hour = Math.floor(minute / 60);
    const rest = minute % 60;
    starts.push(`${String(hour).padStart(2, "0")}:${String(rest).padStart(2, "0")}`);
  }

  function submit(event) {
    event.preventDefault();
    const customer = customers.find((item) => item.id === form.customerId);
    const title =
      form.type === "booking"
        ? form.customerId === "new"
          ? form.customerName
          : customer?.name || ""
        : form.title;

    if (!title.trim()) {
      setError(form.type === "booking" ? "Pilih atau tulis pelanggan." : "Nama sesi masih kosong.");
      return;
    }
    if (!form.courtId) {
      setError("Pilih lapangan.");
      return;
    }
    const end = addMinutes(form.start, form.duration);
    if (timeToMinutes(form.start) < club.openHour * 60 || timeToMinutes(end) > club.closeHour * 60) {
      setError(`Sesi harus di dalam jam buka ${String(club.openHour).padStart(2, "0")}:00–${String(club.closeHour).padStart(2, "0")}:00.`);
      return;
    }

    const message = addEvent({
      ...form,
      title,
      end,
      customerName: form.customerName,
      coach: showCoach ? form.coach : "",
      level: showLevel ? form.level : "",
      spotsTotal: showSpots ? form.spotsTotal : 0,
      spotsTaken: showSpots ? 1 : 0,
      players: form.type === "match" || form.type === "clinic" ? [customer?.name || title].filter(Boolean) : [],
    });
    if (message) {
      setError(message);
      return;
    }
    onClose();
  }

  const showCustomer = form.type === "booking" || form.type === "match";
  const showTitle = form.type !== "booking";
  const showCoach = form.type === "clinic";
  const showLevel = form.type === "match" || form.type === "league";
  const showSpots = form.type === "match" || form.type === "clinic" || form.type === "program";
  const showPrice = form.type !== "block";

  return (
    <form className="flex flex-col gap-4" onSubmit={submit}>
      <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
        {TYPES.map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => update({ type })}
            className={cn(
              "h-8 rounded-lg text-xs",
              form.type === type ? "bg-ink text-white" : "bg-secondary text-foreground",
            )}
          >
            {TYPE_META[type].label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Field label="Lapangan">
          <Select value={form.courtId} onChange={(event) => update({ courtId: event.target.value })}>
            {courts.filter((court) => court.active).map((court) => (
              <option key={court.id} value={court.id}>
                {court.name} · {court.type}
              </option>
            ))}
          </Select>
        </Field>
        <Field label="Tanggal">
          <Input type="date" value={form.date} onChange={(event) => update({ date: event.target.value })} />
        </Field>
        <Field label="Mulai">
          <Select value={form.start} onChange={(event) => update({ start: event.target.value })}>
            {starts.map((time) => (
              <option key={time}>{time}</option>
            ))}
          </Select>
        </Field>
        <Field label="Durasi">
          <Select
            value={form.duration}
            onChange={(event) => update({ duration: Number(event.target.value) })}
          >
            <option value={60}>60 menit</option>
            <option value={90}>90 menit</option>
            <option value={120}>120 menit</option>
          </Select>
        </Field>
      </div>

      {showCustomer ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <Field label={form.type === "match" ? "Penyelenggara" : "Pelanggan"} className="sm:col-span-2">
            <Select value={form.customerId} onChange={(event) => update({ customerId: event.target.value })}>
              <option value="">Pilih pelanggan</option>
              {customers.map((customer) => (
                <option key={customer.id} value={customer.id}>
                  {customer.name}
                </option>
              ))}
              <option value="new">Pelanggan baru</option>
            </Select>
          </Field>
          {form.customerId === "new" ? (
            <>
              <Field label="Nama">
                <Input value={form.customerName} onChange={(event) => update({ customerName: event.target.value })} />
              </Field>
              <Field label="Telepon">
                <Input value={form.phone} onChange={(event) => update({ phone: event.target.value })} />
              </Field>
            </>
          ) : null}
        </div>
      ) : null}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {showTitle ? (
          <Field label={form.type === "block" ? "Alasan" : "Nama sesi"} className={showCoach || showLevel ? "" : "sm:col-span-2"}>
            <Input
              value={form.title}
              placeholder={form.type === "block" ? "Perawatan lapangan" : "Nama yang tampil di jadwal"}
              onChange={(event) => update({ title: event.target.value })}
            />
          </Field>
        ) : null}
        {showCoach ? (
          <Field label="Coach">
            <Select value={form.coach} onChange={(event) => update({ coach: event.target.value })}>
              {coaches.map((coach) => (
                <option key={coach.id}>{coach.name}</option>
              ))}
            </Select>
          </Field>
        ) : null}
        {showLevel ? (
          <Field label="Level">
            <Select value={form.level} onChange={(event) => update({ level: event.target.value })}>
              {["Pemula", "2.0+", "2.5+", "3.0+", "3.5+", "4.0+", "Divisi A", "Semua level"].map((level) => (
                <option key={level}>{level}</option>
              ))}
            </Select>
          </Field>
        ) : null}
        {showSpots ? (
          <Field label="Kapasitas">
            <Input
              type="number"
              min="1"
              value={form.spotsTotal}
              onChange={(event) => update({ spotsTotal: Number(event.target.value) })}
            />
          </Field>
        ) : null}
        {showPrice ? (
          <>
            <Field label="Harga">
              <Input
                type="number"
                min="0"
                step="1000"
                value={form.price}
                onChange={(event) => update({ price: Number(event.target.value), priceTouched: true })}
              />
            </Field>
            <Field label="Pembayaran">
              <Select value={form.payment} onChange={(event) => update({ payment: event.target.value })}>
                <option value="unpaid">Belum bayar</option>
                <option value="partial">Sebagian</option>
                <option value="paid">Lunas</option>
              </Select>
            </Field>
            <Field label="Metode">
              <Select value={form.method} onChange={(event) => update({ method: event.target.value })}>
                <option value="qris">QRIS</option>
                <option value="cash">Tunai</option>
                <option value="transfer">Transfer</option>
                <option value="card">Kartu</option>
              </Select>
            </Field>
          </>
        ) : null}
        <Field label="Catatan" className="sm:col-span-2">
          <Textarea value={form.notes} onChange={(event) => update({ notes: event.target.value })} />
        </Field>
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Batal
        </Button>
        <Button type="submit">Simpan jadwal</Button>
      </div>
    </form>
  );
}
