import { useEffect, useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import StatusBadge from "../../admin/components/StatusBadge";
import { useAuth } from "../../shared/auth/AuthContext";
import { USE_MOCK } from "../../shared/services/api"; // [BARU]
import {
  getPaymentStatus,
  simulateMockPayment,
} from "../../shared/services/paymentService"; // [BARU]
import { rupiah } from "../../shared/utils/format";
import {
  displayStatus,
  expiresOf,
  getOrders,
  updateOrderStatus,
} from "../services/orderService";

const tanggal = (ms) =>
  new Date(ms).toLocaleString("id-ID", {
    dateStyle: "medium",
    timeStyle: "short",
  });

const POLL_MS = 3000; // [BARU] cek status pembayaran tiap 3 detik

const mmss = (ms) => {
  const t = Math.max(0, Math.ceil(ms / 1000));
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  const mm = `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return h > 0 ? `${h}:${mm}` : mm;
};

/** [BARU] QR sementara (placeholder, dipakai kalau backend belum kirim qr_url). */
function QrPlaceholder({ seed = 7 }) {
  const cells = useMemo(() => {
    const n = 21;
    let s = seed;
    const rand = () => (s = (s * 9301 + 49297) % 233280) / 233280;
    const inFinder = (x, y) =>
      (x < 7 && y < 7) || (x > n - 8 && y < 7) || (x < 7 && y > n - 8);
    const list = [];
    for (let y = 0; y < n; y++)
      for (let x = 0; x < n; x++)
        if (!inFinder(x, y) && rand() > 0.52) list.push([x, y]);
    return list;
  }, [seed]);

  const finder = (x, y) => (
    <g key={`${x}-${y}`}>
      <rect x={x} y={y} width="7" height="7" fill="#173a0a" />
      <rect x={x + 1} y={y + 1} width="5" height="5" fill="#fff" />
      <rect x={x + 2} y={y + 2} width="3" height="3" fill="#173a0a" />
    </g>
  );

  return (
    <svg viewBox="0 0 21 21" className="h-40 w-40" shapeRendering="crispEdges">
      <rect width="21" height="21" fill="#fff" />
      {cells.map(([x, y]) => (
        <rect
          key={`${x}-${y}`}
          x={x}
          y={y}
          width="1"
          height="1"
          fill="#173a0a"
        />
      ))}
      {finder(0, 0)}
      {finder(14, 0)}
      {finder(0, 14)}
    </svg>
  );
}

/** [BARU] Panel pembayaran yang tampil langsung di kartu pesanan (QRIS atau Transfer/VA). */
function PanelBayar({ order, now }) {
  const info = order.payInfo || order.pembayaran || {};
  const sisa = expiresOf(order) - now;
  const [copied, setCopied] = useState(false);

  const salin = async () => {
    try {
      await navigator.clipboard.writeText(info.va_number || "");
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard diblokir: pengguna bisa salin manual */
    }
  };

  return (
    <div className="mt-3 rounded-2xl bg-matcha-50 p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <span className="flex items-center gap-2 font-bold text-matcha-900">
          <span
            className="spinner-border spinner-border-sm text-matcha-700"
            role="status"
          />
          Menunggu pembayaran
        </span>
        <span className="text-stone-500">
          Selesaikan dalam <b className="text-matcha-700">{mmss(sisa)}</b>
        </span>
      </div>

      <div className="mt-4 grid items-center gap-4 sm:grid-cols-2">
        <div>
          <div className="text-xs text-stone-500">Total pembayaran</div>
          <div className="text-2xl font-extrabold text-matcha-700">
            {rupiah(order.total)}
          </div>
          <p className="mt-2 text-xs text-stone-500">
            Status berubah sendiri begitu pembayaran terdeteksi, tidak perlu
            menekan tombol apa pun.
          </p>
        </div>

        {order.payment === "qris" ? (
          <div className="flex flex-col items-center">
            <div className="overflow-hidden rounded-xl border border-matcha-200 bg-white p-2">
              {info.qr_url ? (
                <img
                  src={info.qr_url}
                  alt="QRIS pembayaran"
                  className="h-40 w-40 object-contain"
                />
              ) : (
                <QrPlaceholder />
              )}
            </div>
            <div className="mt-1 text-xs font-semibold text-matcha-900">
              Scan dengan e-wallet / m-banking
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-matcha-200 bg-white p-3">
            <div className="text-xs text-stone-500">
              Virtual Account {info.bank || order.bank}
            </div>
            <div className="mt-1 break-all text-lg font-extrabold tracking-wider text-matcha-900">
              {info.va_number || "-"}
            </div>
            <button
              type="button"
              onClick={salin}
              className="btn-outline-matcha mt-2 !py-1 text-xs"
            >
              <i className={`bi ${copied ? "bi-check2" : "bi-clipboard"}`} />{" "}
              {copied ? "Tersalin" : "Salin nomor"}
            </button>
          </div>
        )}
      </div>

      {USE_MOCK && (
        <div className="mt-4 rounded-xl border border-dashed border-matcha-400 p-3 text-center">
          <div className="mb-2 text-[11px] text-stone-500">
            Mode contoh (tanpa backend). Tombol ini tidak ada di versi asli.
          </div>
          <button
            type="button"
            onClick={() => simulateMockPayment(order.id)}
            className="btn-outline-matcha !py-1.5 text-xs"
          >
            Simulasikan pembayaran masuk
          </button>
        </div>
      )}
    </div>
  );
}

/** [BARU] Tahapan pesanan. Diantar: Diproses → Diantar → Selesai. Ambil: Diterima → Selesai (tanpa status bertahap). */
const TAHAP = {
  antar: [
    { key: "Diproses", label: "Sedang Diproses", icon: "bi-cup-hot" },
    { key: "Dikirim", label: "Sedang Diantar", icon: "bi-bicycle" },
    { key: "Selesai", label: "Selesai", icon: "bi-check-lg" },
  ],
  ambil: [
    { key: "Diproses", label: "Pesanan Diterima", icon: "bi-bag-check" },
    { key: "Selesai", label: "Selesai", icon: "bi-check-lg" },
  ],
};

const labelStatus = (o, status) => {
  if (o.type === "ambil" && status === "Menunggu") return "Pesanan Diterima";
  const t = TAHAP[o.type === "ambil" ? "ambil" : "antar"].find(
    (x) => x.key === status,
  );
  return t ? t.label : status;
};

function Progress({ order, status }) {
  const tahap = TAHAP[order.type === "ambil" ? "ambil" : "antar"];
  // Dibayar / Bayar di Tempat / Menunggu = baru masuk, dianggap tahap pertama
  const idx = Math.max(
    0,
    tahap.findIndex((t) => t.key === status),
  );
  const selesai = status === "Selesai";

  return (
    <ol className="mt-3 flex items-start" aria-label="Tahapan pesanan">
      {tahap.map((t, i) => {
        const done = selesai || i < idx;
        const now = !selesai && i === idx;
        return (
          <li
            key={t.key}
            className="relative flex flex-1 flex-col items-center text-center"
          >
            {i > 0 && (
              <span
                className={`absolute right-1/2 top-4 h-0.5 w-full ${i <= idx || selesai ? "bg-matcha-700" : "bg-matcha-100"}`}
              />
            )}
            <span
              className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm ${
                done
                  ? "bg-matcha-700 text-white"
                  : now
                    ? "bg-matcha-700 text-white ring-4 ring-matcha-200"
                    : "bg-matcha-100 text-matcha-700"
              }`}
            >
              <i className={`bi ${done ? "bi-check-lg" : t.icon}`} />
            </span>
            <span
              className={`mt-1 text-[11px] ${done || now ? "font-bold text-matcha-900" : "text-stone-400"}`}
            >
              {t.label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export default function RiwayatPesananPage() {
  const { user } = useAuth();
  const location = useLocation();
  const newOrderId = location.state?.newOrderId; // diisi setelah pesanan dibuat

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now()); // [BARU] untuk hitung mundur

  useEffect(() => {
    let alive = true;
    getOrders(user)
      .then((list) => alive && setOrders(list))
      .catch(
        () =>
          alive &&
          setError("Riwayat pesanan gagal dimuat. Coba muat ulang halaman."),
      )
      .finally(() => alive && setLoading(false));
    return () => {
      alive = false;
    };
  }, [user]);

  // [BARU] id pesanan yang masih menunggu pembayaran (belum kedaluwarsa)
  const pendingKey = orders
    .filter((o) => displayStatus(o) === "Menunggu Pembayaran")
    .map((o) => o.id)
    .join(",");

  // [BARU] Hitung mundur
  useEffect(() => {
    if (!pendingKey) return undefined;
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, [pendingKey]);

  // [BARU] Cek status pembayaran ke server berkala; kalau lunas, muat ulang riwayat
  useEffect(() => {
    if (!pendingKey) return undefined;
    let alive = true;
    const ids = pendingKey.split(",");

    const check = async () => {
      let berubah = false;
      for (const id of ids) {
        try {
          const { status: s } = await getPaymentStatus(id);
          if (s === "paid") {
            updateOrderStatus(user, id, "Dibayar");
            berubah = true;
          }
        } catch {
          /* koneksi putus: coba lagi di putaran berikutnya */
        }
      }
      if (berubah && alive) {
        try {
          const list = await getOrders(user);
          if (alive) setOrders(list);
        } catch {
          /* abaikan */
        }
      }
    };

    check();
    const t = setInterval(check, POLL_MS);
    const onVisible = () => document.visibilityState === "visible" && check();
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      alive = false;
      clearInterval(t);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [pendingKey, user]);

  if (loading) {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center text-sm text-stone-500">
        <span className="spinner-border spinner-border-sm mr-2" role="status" />
        Memuat riwayat pesanan...
      </div>
    );
  }

  if (error) {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center text-sm text-red-600">
        {error}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-matcha-100 text-2xl text-matcha-700">
          <i className="bi bi-clock-history" />
        </div>
        <h2 className="mt-3 text-base font-bold text-matcha-900">
          Belum ada pesanan
        </h2>
        <p className="mt-1 text-sm text-stone-500">
          Pesanan yang kamu buat akan muncul di sini
          {user
            ? "."
            : " (tersimpan di perangkat ini, masuk untuk menyimpannya di akun)."}
        </p>
        <Link to="/konsumen/katalog" className="btn-matcha mt-4 no-underline">
          Pilih Menu
        </Link>
      </div>
    );
  }

  // [BARU] teks banner mengikuti kondisi pesanan yang baru dibuat
  const baruOrder = orders.find((o) => o.id === newOrderId);
  const bannerText = !baruOrder ? null : displayStatus(baruOrder) ===
    "Menunggu Pembayaran" ? (
    <>
      Pesanan <b>#{newOrderId}</b> dibuat. Selesaikan pembayaran di bawah ya.
    </>
  ) : baruOrder.payment === "tunai" ? (
    <>
      Pesanan <b>#{newOrderId}</b> berhasil dibuat. Siapkan pembayaran tunai ya!
    </>
  ) : (
    <>
      Pembayaran pesanan <b>#{newOrderId}</b> berhasil. Terima kasih!
    </>
  );

  return (
    <div className="mx-auto w-full max-w-4xl space-y-4">
      {!user && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-matcha-200 bg-matcha-50 px-4 py-3 text-xs text-stone-600">
          <span>
            <i className="bi bi-info-circle mr-1.5 text-matcha-700" />
            Kamu belum masuk, jadi riwayat ini hanya tersimpan di
            perangkat/browser ini.
          </span>
          <span>
            <Link
              to="/login"
              state={{ from: location }}
              className="font-semibold text-matcha-700"
            >
              Masuk
            </Link>{" "}
            atau{" "}
            <Link
              to="/daftar"
              state={{ from: location }}
              className="font-semibold text-matcha-700"
            >
              daftar
            </Link>{" "}
            untuk menyimpannya di akun &amp; dapat diskon 5%.
          </span>
        </div>
      )}

      {bannerText && (
        <div
          className="animate-pop-in flex items-center gap-3 rounded-2xl bg-matcha-700 px-4 py-3 text-sm text-white"
          role="status"
        >
          <i className="bi bi-check-circle-fill text-lg" />
          <span>{bannerText}</span>
        </div>
      )}

      {orders.map((o) => {
        const status = displayStatus(o);
        const items = o.items || [];
        const baru = o.id === newOrderId;
        const menunggu = status === "Menunggu Pembayaran";
        const lacak = !menunggu && status !== "Kedaluwarsa"; // [BARU] tampilkan tahapan pesanan
        return (
          <div
            key={o.id}
            className={`card-soft p-5 ${baru ? "ring-2 ring-matcha-500" : ""}`}
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <div className="text-sm font-bold text-matcha-900">
                  Pesanan #{o.id}
                </div>
                <div className="text-xs text-stone-500">
                  {tanggal(o.createdAt)}
                </div>
              </div>
              <StatusBadge status={status} label={labelStatus(o, status)} />
            </div>

            {/* [BARU] QR / VA langsung di sini */}
            {menunggu && <PanelBayar order={o} now={now} />}

            {/* [BARU] tahapan: Sedang Diproses -> Sedang Diantar -> Selesai */}
            {lacak && <Progress order={o} status={status} />}

            <ul className="mt-3 divide-y divide-matcha-100/70 text-sm">
              {items.map((i, idx) => (
                <li key={idx} className="flex justify-between gap-3 py-2">
                  <div>
                    <div className="font-semibold text-matcha-900">
                      {i.name}
                    </div>
                    <div className="text-xs text-stone-500">
                      {i.size} · gula {i.sweet} · {i.qty}x
                      {i.note ? ` · "${i.note}"` : ""}
                    </div>
                  </div>
                  <div className="shrink-0 font-semibold text-stone-700">
                    {rupiah(i.unitPrice * i.qty)}
                  </div>
                </li>
              ))}
            </ul>

            <div className="mt-2 grid gap-4 border-t border-matcha-100 pt-3 text-sm sm:grid-cols-2">
              <div className="text-xs text-stone-500">
                <div className="font-semibold text-stone-600">
                  {o.type === "ambil" ? "Ambil sendiri" : "Diantar"}
                </div>
                <div className="mt-0.5">
                  {o.type === "ambil"
                    ? `${o.address} · ${o.pickup || ""}`
                    : o.address}
                </div>
              </div>
              <dl className="space-y-1">
                <div className="flex justify-between">
                  <dt className="text-stone-500">Subtotal</dt>
                  <dd>{rupiah(o.subtotal)}</dd>
                </div>
                {o.discount > 0 && (
                  <div className="flex justify-between">
                    <dt className="text-stone-500">Diskon member</dt>
                    <dd className="text-matcha-700">- {rupiah(o.discount)}</dd>
                  </div>
                )}
                <div className="flex justify-between">
                  <dt className="text-stone-500">Ongkir</dt>
                  <dd>{o.shipping ? rupiah(o.shipping) : "Gratis"}</dd>
                </div>
                <div className="flex justify-between border-t border-matcha-100 pt-1 font-bold text-matcha-900">
                  <dt>Total</dt>
                  <dd className="text-matcha-700">{rupiah(o.total)}</dd>
                </div>
                {/* [TUNAI] tampilkan metode pembayaran ([BARU] + Transfer/VA) */}
                <div className="flex justify-between text-xs text-stone-500">
                  <dt>Pembayaran</dt>
                  <dd>
                    {o.payment === "tunai"
                      ? "Tunai"
                      : o.payment === "transfer"
                        ? "Transfer / VA"
                        : "QRIS"}
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        );
      })}
    </div>
  );
}
