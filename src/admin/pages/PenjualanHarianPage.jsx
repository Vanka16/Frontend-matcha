import { useState } from "react";
import Section from "../components/Section";
import StatCard from "../components/StatCard";
import {
  getSelesaiHariIni,
  penjualanHarian,
  penjualanPerJam,
} from "../data/adminData";
import { rupiah } from "../../shared/utils/format";

export default function PenjualanHarianPage() {
  const [catatan, setCatatan] = useState([]);
  const [form, setForm] = useState({ ket: "", nominal: "" });
  const [fokus, setFokus] = useState(null);

  // [BARU] pesanan yang diselesaikan admin hari ini (dari halaman Pesanan)
  const selesai = getSelesaiHariIni();
  const tambahan =
    catatan.reduce((s, c) => s + c.nominal, 0) +
    selesai.reduce((s, p) => s + p.total, 0);
  const omzet = penjualanHarian.omzet + tambahan;
  const transaksi = penjualanHarian.transaksi + catatan.length + selesai.length;
  const rata = Math.round(omzet / transaksi);

  const maks = Math.max(...penjualanPerJam.map((j) => j.nilai));
  const puncak = penjualanPerJam.reduce((a, b) =>
    b.nilai > a.nilai ? b : a,
  ).jam;

  const simpan = (e) => {
    e.preventDefault();
    // TODO API: POST /penjualan { keterangan, nominal }
    setCatatan((c) => [{ ...form, nominal: Number(form.nominal) }, ...c]);
    setForm({ ket: "", nominal: "" });
  };

  const tanggal = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full">
      <div className="card-soft p-5">
        <Section
          title="Penjualan Harian — Telang"
          desc="Ringkasan transaksi berdasarkan catatan kasir hari ini."
          action={
            <a href="#catatan-cepat" className="btn-matcha !py-2 no-underline">
              <i className="bi bi-plus-lg" /> Catat Penjualan
            </a>
          }
        />
        <div className="mb-4 inline-block rounded-lg border border-matcha-200 bg-white px-3 py-1.5 text-xs text-stone-600">
          Tanggal: {tanggal}
        </div>

        <div className="row g-3">
          <div className="col-6 col-lg-3">
            <StatCard
              label="Total omzet"
              value={rupiah(omzet)}
              note="+8,2%"
              icon="bi-cash"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard label="Transaksi" value={transaksi} icon="bi-receipt" />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard
              label="Rata-rata / transaksi"
              value={rupiah(rata)}
              icon="bi-calculator"
            />
          </div>
          <div className="col-6 col-lg-3">
            <StatCard
              label="Menu terjual"
              value={`${penjualanHarian.menuTerjual + selesai.reduce((s, p) => s + p.item, 0)} cup`}
              icon="bi-cup-straw"
            />
          </div>
        </div>
      </div>

      <div className="row g-4 mt-0">
        <div className="col-12 col-lg-8">
          <div className="card-soft p-5">
            <Section
              title="Ringkasan penjualan per jam"
              desc="Jam tersibuk ditandai hijau tua."
            />
            <div className="flex h-56 items-end gap-2 sm:gap-3">
              {penjualanPerJam.map((j) => (
                <div
                  key={j.jam}
                  className="group relative flex h-full flex-1 flex-col items-center justify-end"
                  onMouseEnter={() => setFokus(j.jam)}
                  onMouseLeave={() => setFokus(null)}
                >
                  {fokus === j.jam && (
                    <div className="absolute -top-1 z-10 -translate-y-full whitespace-nowrap rounded-md bg-matcha-900 px-2 py-1 text-[11px] font-semibold text-white">
                      {rupiah(j.nilai)}
                    </div>
                  )}
                  <div
                    className={`w-full rounded-t-lg transition ${j.jam === puncak ? "bg-matcha-700" : "bg-matcha-300 group-hover:bg-matcha-400"}`}
                    style={{ height: `${(j.nilai / maks) * 100}%` }}
                  />
                  <div className="mt-2 text-[11px] text-stone-400">
                    {j.jam}.00
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4" id="catatan-cepat">
          <form onSubmit={simpan} className="card-soft p-5">
            <h3 className="text-sm font-bold text-matcha-900">Catatan cepat</h3>
            <div className="mt-3">
              <label className="label-matcha !text-xs">Keterangan</label>
              <input
                required
                className="input-matcha"
                placeholder="Contoh: pemesanan lewat telepon"
                value={form.ket}
                onChange={(e) => setForm({ ...form, ket: e.target.value })}
              />
            </div>
            <div className="mt-3">
              <label className="label-matcha !text-xs">Nominal penjualan</label>
              <input
                required
                type="number"
                min="0"
                className="input-matcha"
                placeholder="Rp"
                value={form.nominal}
                onChange={(e) => setForm({ ...form, nominal: e.target.value })}
              />
            </div>
            <button type="submit" className="btn-matcha mt-4 w-full">
              Simpan Catatan
            </button>

            {catatan.length > 0 && (
              <ul className="mt-4 space-y-1.5 border-t border-matcha-100 pt-3 text-xs">
                {catatan.map((c, i) => (
                  <li key={i} className="flex justify-between gap-2">
                    <span className="truncate text-stone-600">{c.ket}</span>
                    <span className="font-semibold text-matcha-700">
                      {rupiah(c.nominal)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}
