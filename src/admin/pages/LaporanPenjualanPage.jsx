import { useState } from "react";
import Section from "../components/Section";
import StatCard from "../components/StatCard";
import { laporanPeriode, opsiPeriode, rentangPeriode } from "../data/adminData";
import { rupiah } from "../../shared/utils/format";

export default function LaporanPenjualanPage() {
  const [periode, setPeriode] = useState("bulanan"); // [PERIODE] 'harian' | 'mingguan' | 'bulanan'
  const d = laporanPeriode[periode];
  const maks = Math.max(...d.tren.map((m) => m.nilai));
  const rata = Math.round(
    d.omzet / (d.bagiRata === "transaksi" ? d.transaksi : d.bagiRata),
  );
  const banyak = d.tren.length > 6; // bar banyak: nilai ditulis ringkas
  const ringkas = (n) =>
    n >= 1000000
      ? `${(n / 1000000).toFixed(1).replace(".", ",")} jt`
      : `${Math.round(n / 1000)} rb`;

  return (
    <div className="w-full">
      <div className="card-soft p-5">
        <Section
          title={`Rekap Penjualan ${d.nama}`}
          desc="Pilih periode untuk melihat ringkasan penjualan."
          action={
            <button className="btn-matcha !py-2" onClick={() => window.print()}>
              Ekspor Laporan
            </button>
          }
        />
        <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-stone-600">
          {/* [PERIODE] pilih periode laporan */}
          <select
            className="form-select form-select-sm !w-auto !rounded-lg"
            value={periode}
            onChange={(e) => setPeriode(e.target.value)}
            aria-label="Periode laporan"
          >
            {opsiPeriode.map((o) => (
              <option key={o.key} value={o.key}>
                {o.label}
              </option>
            ))}
          </select>
          <span className="rounded-lg border border-matcha-200 bg-white px-3 py-1.5">
            {rentangPeriode(periode)}
          </span>
        </div>

        <div className="row g-3">
          <div className="col-6 col-lg-3">
            <StatCard
              label="Total omzet"
              value={rupiah(d.omzet)}
              note={periode === "bulanan" ? "+8,5%" : undefined}
              icon="bi-cash"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard
              label="Total transaksi"
              value={d.transaksi.toLocaleString("id-ID")}
              icon="bi-receipt"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard
              label={
                periode === "harian"
                  ? "Rata-rata / transaksi"
                  : "Rata-rata harian"
              }
              value={rupiah(rata)}
              icon="bi-calendar-day"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard
              label="Menu terjual"
              value={`${d.menuTerjual.toLocaleString("id-ID")} cup`}
              icon="bi-cup-straw"
            />
          </div>
        </div>
      </div>

      <div className="card-soft mt-4 p-5">
        <Section title={d.trenJudul} desc={d.trenDesc} />
        <div
          className={`flex h-64 items-end justify-around px-2 sm:px-10 ${banyak ? "gap-1.5" : "gap-4"}`}
        >
          {d.tren.map((m) => (
            <div
              key={m.label}
              className="flex h-full w-full max-w-[110px] flex-col items-center justify-end"
            >
              <div className="mb-1 text-[10px] font-semibold text-matcha-800 sm:text-[11px]">
                {banyak ? ringkas(m.nilai) : rupiah(m.nilai)}
              </div>
              <div
                className={`w-full rounded-t-xl ${m.nilai === maks ? "bg-matcha-700" : "bg-matcha-400"}`}
                style={{ height: `${(m.nilai / maks) * 80}%` }}
              />
              <div className="mt-2 text-xs text-stone-500">{m.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
