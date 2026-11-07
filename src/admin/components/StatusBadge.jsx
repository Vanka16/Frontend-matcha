const TONES = {
  green: "bg-matcha-700 text-white",
  amber: "bg-amber-600 text-white",
  red: "bg-red-600 text-white",
};

const MAP = {
  Aktif: "green",
  Aman: "green",
  Dibayar: "green",
  Selesai: "green",
  Dikirim: "amber",
  "Siap Diambil": "amber",
  Diproses: "amber",
  Menunggu: "amber",
  Menipis: "amber",
  "Menunggu Pembayaran": "amber",
  "Bayar di Tempat": "amber", // [TUNAI]
  Kedaluwarsa: "red",
  Habis: "red",
};

// [BARU] `label` opsional: teks yang ditampilkan (warna tetap ikut `status`)
export default function StatusBadge({ status, label }) {
  const tone = TONES[MAP[status] || "green"];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${tone}`}
    >
      {label || status}
    </span>
  );
}
