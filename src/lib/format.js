export function formatRupiah(amount) {
  const thousands = amount / 1000;
  const value = Number.isInteger(thousands)
    ? String(thousands)
    : thousands.toFixed(1).replace(/\.0$/, "");

  return `Rp ${value}k`;
}

export function formatRupiahFull(amount) {
  return `Rp ${new Intl.NumberFormat("id-ID").format(amount || 0)}`;
}

export function priceForDuration(price, minutes = 90) {
  return Math.round((price * minutes) / 90 / 1000) * 1000;
}

export function levelLabel(level) {
  if (!level || level === "-") return "—";
  const text = String(level);
  if (/level|pemula|\+/i.test(text)) return text;
  return `Level ${text}`;
}

export const PAYMENT_LABEL = {
  paid: "Lunas",
  unpaid: "Belum bayar",
  partial: "Sebagian",
  refunded: "Refund",
};

export const METHOD_LABEL = {
  qris: "QRIS",
  cash: "Tunai",
  transfer: "Transfer",
  card: "Kartu",
};

export const STATUS_LABEL = {
  confirmed: "Terkonfirmasi",
  pending: "Menunggu",
  cancelled: "Dibatalkan",
  completed: "Selesai",
};

export const TYPE_META = {
  booking: {
    label: "Booking",
    chip: "bg-[#e7f7a4] text-ink",
    block: "border border-[#c6e56a] bg-[#dff6a6] text-ink hover:bg-[#d4f094]",
  },
  match: {
    label: "Match",
    chip: "bg-[#d9f0e4] text-ink",
    block: "border border-[#b7dfc8] bg-[#d9f0e4] text-ink hover:bg-[#c9e8d8]",
  },
  clinic: {
    label: "Klinik",
    chip: "bg-[#f3ebc4] text-ink",
    block: "border border-[#e4d48a] bg-[#f3ebc4] text-ink hover:bg-[#efe3ae]",
  },
  program: {
    label: "Program",
    chip: "bg-[#e4e8f8] text-ink",
    block: "border border-[#c9d0ee] bg-[#e4e8f8] text-ink hover:bg-[#d6dcf3]",
  },
  league: {
    label: "Liga",
    chip: "bg-[#f8e4ea] text-ink",
    block: "border border-[#ecc4d0] bg-[#f8e4ea] text-ink hover:bg-[#f3d4dd]",
  },
  block: {
    label: "Blokir",
    chip: "bg-secondary text-muted-foreground",
    block: "border border-[#ddd9cf] bg-[#eceae3] text-[#5c6560] hover:bg-[#e4e2da]",
  },
};
