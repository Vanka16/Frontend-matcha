import { useMemo, useState } from "react";
import Section from "../components/Section";
import StatCard from "../components/StatCard";
import StatusBadge from "../components/StatusBadge";
import {
  alurStatus,
  getSelesaiHariIni,
  pesananAwal,
  statusPesanan,
  tambahSelesaiHariIni,
} from "../data/adminData";
import { rupiah } from "../../shared/utils/format";

export default function PesananPage() {
  const [pesanan, setPesanan] = useState(pesananAwal);
  const [status, setStatus] = useState("Semua status");
  const [q, setQ] = useState("");
  const [detail, setDetail] = useState(null);

  const tampil = useMemo(
    () =>
      pesanan.filter(
        (p) =>
          (status === "Semua status" || p.status === status) &&
          (p.id + p.pembeli).toLowerCase().includes(q.toLowerCase()),
      ),
    [pesanan, status, q],
  );

  const ubahStatus = (id, s) =>
    setPesanan((list) =>
      list.map((p) => (p.id === id ? { ...p, status: s } : p)),
    );

  // [BARU] Tombol "Selesaikan": tandai selesai + catat ke penjualan hari ini
  const selesaikan = (p) => {
    const belumBayar = p.pembayaran !== "Dibayar" && p.metode !== "Tunai";
    const pesan = belumBayar
      ? `Pesanan ${p.id} belum dibayar (${p.metode}). Tetap diselesaikan?`
      : `Tandai pesanan ${p.id} selesai dan catat ke penjualan hari ini?`;
    if (!window.confirm(pesan)) return;
    // TODO API: PATCH /pesanan/:id/selesai  (backend set status Selesai, pembayaran Dibayar, masuk laporan harian)
    setPesanan((list) =>
      list.map((x) =>
        x.id === p.id ? { ...x, status: "Selesai", pembayaran: "Dibayar" } : x,
      ),
    );
    tambahSelesaiHariIni(p);
    setDetail(null);
  };

  // [BARU2] Tombol aksi bertahap.
  // Antar : Menunggu -> [Proses] -> Sedang Diproses -> [Antar] -> Sedang Diantar -> [Selesaikan] -> Selesai
  // Ambil : tanpa status bertahap, langsung [Selesaikan] -> Selesai
  const LANGKAH = {
    Antar: {
      Menunggu: { next: "Diproses", label: "Proses", icon: "bi-cup-hot" },
      Diproses: { next: "Dikirim", label: "Antar", icon: "bi-bicycle" },
    },
  };
  const aksi = (p) => LANGKAH[p.jenis]?.[p.status]; // undefined = tahap terakhir -> tombol Selesaikan

  const lanjut = (p) => {
    const a = aksi(p);
    if (!a) return selesaikan(p);
    // TODO API: PATCH /pesanan/:id/status { status: a.next }
    ubahStatus(p.id, a.next);
    setDetail((d) => (d && d.id === p.id ? { ...d, status: a.next } : d));
  };

  // [BARU2] teks status yang ditampilkan (sama dengan yang dilihat pembeli)
  const labelStatus = (s, jenis) =>
    s === "Diproses"
      ? "Sedang Diproses"
      : s === "Dikirim"
        ? "Sedang Diantar"
        : s === "Menunggu" && jenis === "Ambil"
          ? "Pesanan Masuk"
          : s;

  // [BARU] angka ringkasan dihitung dari daftar pesanan
  const perluDiproses = pesanan.filter(
    (p) => p.status === "Menunggu" || p.status === "Diproses",
  ).length;
  const dikirim = pesanan.filter((p) => p.status === "Dikirim").length;
  const selesaiHariIni = pesanan.filter((p) => p.status === "Selesai").length;

  return (
    <div className="w-full">
      <div className="row g-3 mb-4">
        <div className="col-6 col-lg-3">
          <StatCard
            label="Pesanan hari ini"
            value={pesanan.length}
            note="+12%"
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            label="Perlu diproses"
            value={perluDiproses}
            note="Segera"
            tone="warn"
            icon="bi-hourglass-split"
          />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard label="Dalam pengiriman" value={dikirim} icon="bi-truck" />
        </div>
        <div className="col-6 col-lg-3">
          <StatCard
            label="Selesai hari ini"
            value={selesaiHariIni}
            note="—"
            tone="muted"
            icon="bi-check2-circle"
          />
        </div>
      </div>

      <div className="card-soft p-5">
        <Section
          title="Pesanan Masuk"
          desc="Perbarui status pesanan agar pembeli mendapat informasi terbaru."
        />

        <div className="mb-3 flex flex-wrap items-center gap-3">
          <select
            className="form-select form-select-sm !w-auto !rounded-lg"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option>Semua status</option>
            {statusPesanan.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
          <span className="rounded-lg border border-matcha-200 bg-white px-3 py-1.5 text-xs text-stone-600">
            Tanggal: Hari ini
          </span>
          <div className="relative ml-auto">
            <i className="bi bi-search pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-xs text-stone-400" />
            <input
              className="w-52 rounded-lg border border-matcha-200 bg-white py-1.5 pl-8 pr-3 text-sm outline-none focus:border-matcha-500"
              placeholder="Cari pesanan..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-matcha table-hover align-middle">
            <thead>
              <tr>
                <th>ID Pesanan</th>
                <th>Pembeli</th>
                <th>Jenis</th>
                <th>Waktu</th>
                <th>Item</th>
                <th>Total</th>
                <th>Pembayaran</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((p) => (
                <tr key={p.id}>
                  <td className="font-semibold text-matcha-900">{p.id}</td>
                  <td>{p.pembeli}</td>
                  <td>
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-matcha-800">
                      <i
                        className={`bi ${p.jenis === "Ambil" ? "bi-bag-check" : "bi-bicycle"}`}
                      />
                      {p.jenis === "Ambil" ? "Ambil sendiri" : "Diantar"}
                    </span>
                  </td>
                  <td>{p.waktu}</td>
                  <td>{p.item} menu</td>
                  <td>{rupiah(p.total)}</td>
                  <td>
                    <StatusBadge status={p.pembayaran} />
                    <div className="mt-0.5 text-[11px] text-stone-500">
                      {p.metode}
                    </div>{" "}
                    {/* [BARU] */}
                  </td>
                  <td>
                    <StatusBadge
                      status={p.status}
                      label={labelStatus(p.status, p.jenis)}
                    />{" "}
                    {/* [BARU2] */}
                  </td>
                  <td className="whitespace-nowrap">
                    <button
                      className="text-xs font-semibold text-matcha-700 hover:underline"
                      onClick={() => setDetail(p)}
                    >
                      Detail
                    </button>
                    {/* [BARU2] tombol aksi bertahap: Proses -> Antar -> Selesaikan */}
                    {p.status !== "Selesai" && (
                      <button
                        className="btn-matcha ml-2 !px-3 !py-1 text-xs"
                        onClick={() => lanjut(p)}
                      >
                        <i
                          className={`bi ${aksi(p)?.icon || "bi-check2-circle"}`}
                        />{" "}
                        {aksi(p)?.label || "Selesaikan"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {tampil.length === 0 && (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-stone-400">
                    Tidak ada pesanan yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {detail && (
        <div
          className="modal d-block"
          style={{ background: "rgba(31,61,26,.45)" }}
          onClick={() => setDetail(null)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content !rounded-2xl border-0 p-2">
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title !text-base !font-bold text-matcha-900">
                  Pesanan {detail.id}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Tutup"
                  onClick={() => setDetail(null)}
                />
              </div>
              <div className="modal-body text-sm">
                <dl className="mb-4 space-y-1.5">
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Pembeli</dt>
                    <dd>{detail.pembeli}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Jenis</dt>
                    <dd>
                      {detail.jenis === "Ambil" ? "Ambil sendiri" : "Diantar"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Status</dt>
                    <dd>
                      <StatusBadge
                        status={detail.status}
                        label={labelStatus(detail.status, detail.jenis)}
                      />
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Waktu</dt>
                    <dd>{detail.waktu}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Item</dt>
                    <dd>{detail.item} menu</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Total</dt>
                    <dd className="font-bold">{rupiah(detail.total)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Metode bayar</dt>
                    <dd>{detail.metode}</dd>
                  </div>
                </dl>
                {/* [BARU] Ambil (pesan di tempat): tanpa konfirmasi status. Antar: ubah status bertahap, selesai lewat tombol. */}
                {detail.status === "Selesai" ? (
                  <div className="rounded-xl bg-matcha-50 px-3 py-2 text-xs text-matcha-800">
                    Pesanan ini sudah selesai.
                  </div>
                ) : detail.jenis === "Ambil" ? (
                  <div className="rounded-xl bg-matcha-50 px-3 py-2 text-xs text-matcha-800">
                    Pesanan ambil sendiri tidak memakai status bertahap. Tekan{" "}
                    <b>Selesaikan</b> kalau sudah diambil pembeli.
                  </div>
                ) : (
                  <>
                    <label className="label-matcha !text-xs">Ubah status</label>
                    <select
                      className="input-matcha"
                      value={detail.status}
                      onChange={(e) => {
                        ubahStatus(detail.id, e.target.value);
                        setDetail({ ...detail, status: e.target.value });
                      }}
                    >
                      {alurStatus(detail.jenis)
                        .filter((s) => s !== "Selesai")
                        .map((s) => (
                          <option key={s} value={s}>
                            {labelStatus(s)}
                          </option> /* [BARU2] */
                        ))}
                    </select>
                  </>
                )}
              </div>
              <div className="modal-footer border-0 pt-0">
                <button
                  className="btn-outline-matcha"
                  onClick={() => setDetail(null)}
                >
                  Tutup
                </button>
                {detail.status !== "Selesai" && (
                  <button className="btn-matcha" onClick={() => lanjut(detail)}>
                    <i
                      className={`bi ${aksi(detail)?.icon || "bi-check2-circle"}`}
                    />{" "}
                    {aksi(detail)
                      ? `${aksi(detail).label} Pesanan`
                      : "Selesaikan Pesanan"}{" "}
                    {/* [BARU2] */}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
