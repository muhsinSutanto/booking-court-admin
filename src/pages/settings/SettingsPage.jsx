import { useState } from "react";
import { PageBody, PageHeader, Panel } from "@/components/common/Blocks";
import { Button } from "@/components/ui/button";
import { Field, Input, Select } from "@/components/ui/field";
import { useClub } from "@/context/ClubContext";
import { cn } from "@/lib/utils";
import { formatRupiahFull } from "@/lib/format";

export function SettingsPage() {
  const { club, courts, staff, updateClub, addCourt, toggleCourt, resetDemo } = useClub();
  const [profile, setProfile] = useState(club);
  const [boundClubId, setBoundClubId] = useState(club.id);
  const [saved, setSaved] = useState(false);
  const [courtForm, setCourtForm] = useState({ name: "", type: "Outdoor", price: "300000" });
  const [courtError, setCourtError] = useState("");
  const [hourError, setHourError] = useState("");

  if (boundClubId !== club.id) {
    setBoundClubId(club.id);
    setProfile(club);
    setSaved(false);
    setHourError("");
  }

  function saveProfile(event) {
    event.preventDefault();
    const openHour = Number(profile.openHour);
    const closeHour = Number(profile.closeHour);
    if (openHour >= closeHour) {
      setHourError("Jam tutup harus setelah jam buka.");
      return;
    }
    updateClub({
      name: profile.name.trim(),
      city: profile.city.trim(),
      area: profile.area.trim(),
      address: profile.address.trim(),
      phone: profile.phone.trim(),
      email: profile.email.trim(),
      openHour,
      closeHour,
    });
    setHourError("");
    setSaved(true);
  }

  function saveCourt(event) {
    event.preventDefault();
    if (!courtForm.name.trim()) {
      setCourtError("Nama lapangan wajib diisi.");
      return;
    }
    addCourt(courtForm);
    setCourtForm({ name: "", type: "Outdoor", price: "300000" });
    setCourtError("");
  }

  const hours = Array.from({ length: 18 }, (_, index) => index + 6);
  const visibleStaff = staff.filter((person) => person.clubId === "all" || person.clubId === club.id);

  return (
    <PageBody>
      <PageHeader
        title="Pengaturan"
        description="Super admin mengatur venue yang sedang dipilih. Ganti venue dari menu di kanan atas."
      />

      <div className="grid gap-3 xl:grid-cols-2">
        <Panel className="p-4">
          <p className="font-medium">Profil venue</p>
          <form className="mt-4 grid gap-3" onSubmit={saveProfile}>
            <Field label="Nama">
              <Input value={profile.name} onChange={(event) => setProfile({ ...profile, name: event.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Kota">
                <Input value={profile.city} onChange={(event) => setProfile({ ...profile, city: event.target.value })} />
              </Field>
              <Field label="Area">
                <Input value={profile.area} onChange={(event) => setProfile({ ...profile, area: event.target.value })} />
              </Field>
            </div>
            <Field label="Alamat">
              <Input value={profile.address} onChange={(event) => setProfile({ ...profile, address: event.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Telepon">
                <Input value={profile.phone} onChange={(event) => setProfile({ ...profile, phone: event.target.value })} />
              </Field>
              <Field label="Email">
                <Input value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} />
              </Field>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Jam buka">
                <Select value={profile.openHour} onChange={(event) => setProfile({ ...profile, openHour: Number(event.target.value) })}>
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {String(hour).padStart(2, "0")}:00
                    </option>
                  ))}
                </Select>
              </Field>
              <Field label="Jam tutup">
                <Select value={profile.closeHour} onChange={(event) => setProfile({ ...profile, closeHour: Number(event.target.value) })}>
                  {hours.map((hour) => (
                    <option key={hour} value={hour}>
                      {String(hour).padStart(2, "0")}:00
                    </option>
                  ))}
                </Select>
              </Field>
            </div>
            {hourError ? <p className="text-sm text-destructive">{hourError}</p> : null}
            <div className="flex items-center gap-3">
              <Button type="submit">Simpan venue</Button>
              {saved ? <span className="text-sm text-muted-foreground">Tersimpan</span> : null}
            </div>
          </form>
        </Panel>

        <Panel className="p-4">
          <p className="font-medium">Lapangan</p>
          <div className="mt-3 flex flex-col">
            {courts.map((court) => (
              <div key={court.id} className="flex items-center justify-between gap-3 border-t border-border py-3 first:border-t-0">
                <div>
                  <p className="text-sm font-medium">{court.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {court.type} · {formatRupiahFull(court.price)} / 90 menit
                  </p>
                </div>
                <button
                  type="button"
                  role="switch"
                  aria-checked={court.active}
                  onClick={() => toggleCourt(court.id)}
                  className={cn("h-6 w-11 rounded-full p-0.5 transition-colors", court.active ? "bg-ink" : "bg-[#ddd9cf]")}
                >
                  <span className={cn("block size-5 rounded-full bg-white transition-transform", court.active && "translate-x-5")} />
                </button>
              </div>
            ))}
          </div>
          <form className="mt-2 grid gap-3 border-t border-border pt-4" onSubmit={saveCourt}>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Nama lapangan">
                <Input value={courtForm.name} onChange={(event) => setCourtForm({ ...courtForm, name: event.target.value })} />
              </Field>
              <Field label="Tipe">
                <Input value={courtForm.type} onChange={(event) => setCourtForm({ ...courtForm, type: event.target.value })} />
              </Field>
            </div>
            <Field label="Harga 90 menit">
              <Input type="number" value={courtForm.price} onChange={(event) => setCourtForm({ ...courtForm, price: event.target.value })} />
            </Field>
            {courtError ? <p className="text-sm text-destructive">{courtError}</p> : null}
            <div>
              <Button type="submit" variant="outline">
                Tambah lapangan
              </Button>
            </div>
          </form>
        </Panel>
      </div>

      <Panel className="overflow-auto">
        <div className="border-b px-4 py-3">
          <p className="font-medium">Akses staf</p>
          <p className="text-sm text-muted-foreground">Akun login demo tetap super admin. Daftar ini hanya penunjuk peran di venue.</p>
        </div>
        <table className="w-full text-sm">
          <tbody>
            {visibleStaff.map((person) => (
              <tr key={person.id} className="border-t border-border">
                <td className="px-4 py-3 font-medium">{person.name}</td>
                <td className="px-4 py-3">{person.role}</td>
                <td className="px-4 py-3 text-muted-foreground">{person.email}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Panel>

      <Panel className="flex flex-wrap items-center justify-between gap-3 p-4">
        <div>
          <p className="font-medium">Data demo</p>
          <p className="text-sm text-muted-foreground">Mengembalikan pelanggan, jadwal, stok, dan promo ke contoh awal.</p>
        </div>
        <Button type="button" variant="outline" onClick={resetDemo}>
          Reset data demo
        </Button>
      </Panel>
    </PageBody>
  );
}
