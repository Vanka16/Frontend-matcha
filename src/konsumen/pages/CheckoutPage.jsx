import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../shared/auth/AuthContext";
import { rupiah } from "../../shared/utils/format";
import { useCart } from "../context/CartContext";
import { createOrder, saveOrder } from "../services/orderService"; // [BARU] createOrder
import {
  DISKON_MEMBER,
  GERAI,
  ONGKIR_FLAT,
  hitungOngkir,
  orderTypes,
  pickupOptions,
} from "../data/menu";

// [BARU] pilihan metode pembayaran
const BANKS = ["BCA", "BNI", "BRI", "Permata"];

export default function CheckoutPage() {
  const { items, count, subtotal, clear } = useCart(); // [TUNAI] tambah clear
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth(); // tamu (belum login) tetap bisa checkout
  const [type, setType] = useState("antar");
  const [form, setForm] = useState({
    name: user?.name || "",
    phone: "",
    address: "",
  });
  const [pickup, setPickup] = useState(pickupOptions[0]);
  const [loading, setLoading] = useState(false);
  const [payMethod, setPayMethod] = useState("qris"); // [TUNAI] 'qris' | 'transfer' | 'tunai'
  const [bank, setBank] = useState(BANKS[0]); // [BARU] bank untuk Transfer / VA
  const [error, setError] = useState(""); // [BARU]
  const tunai = payMethod === "tunai"; // [TUNAI]

  const antar = type === "antar";
  const ongkir = antar ? hitungOngkir() : 0;
  // Diskon hanya untuk yang login. Backend wajib menghitung ulang diskon ini.
  const diskon = user ? Math.round(subtotal * DISKON_MEMBER) : 0;
  const total = subtotal - diskon + ongkir;

  const onChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    // TODO API: POST /pesanan  (boleh tanpa token untuk tamu)
    //   body: { items, jenis: type, penerima: { name, phone }, alamat, pickup }
    //   (ongkir & diskon member dihitung ulang di backend supaya tidak bisa dimanipulasi)
    const order = {
      id: `MB-${Date.now().toString().slice(-6)}`,
      type,
      items: items.map(({ name, size, sweet, qty, unitPrice, note }) => ({
        name,
        size,
        sweet,
        qty,
        unitPrice,
        note,
      })),
      subtotal,
      discount: diskon,
      shipping: ongkir,
      total,
      name: form.name,
      phone: form.phone,
      address: antar ? form.address : GERAI,
      pickup: antar ? null : pickup,
      payment: payMethod, // [TUNAI] 'qris' | 'transfer' | 'tunai'
      bank: payMethod === "transfer" ? bank : null, // [BARU]
      status: tunai ? "Bayar di Tempat" : "Menunggu Pembayaran", // [TUNAI]
      createdAt: Date.now(),
    };
    // [BARU] Semua metode (QRIS, Transfer/VA, Tunai) langsung ke Riwayat Pesanan.
    // QR / nomor VA ditampilkan di sana, tidak ada lagi halaman pembayaran terpisah.
    try {
      const saved = await createOrder(user, order);
      saveOrder(user, saved); // masuk Riwayat Pesanan (login: ke akun, tamu: ke perangkat ini)
      clear();
      navigate("/konsumen/riwayat", { state: { newOrderId: saved.id } });
    } catch {
      setError("Pesanan gagal dibuat. Periksa koneksi lalu coba lagi.");
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="card-soft mx-auto max-w-lg p-10 text-center">
        <p className="text-sm text-stone-500">Belum ada menu di keranjang.</p>
        <Link to="/konsumen/katalog" className="btn-matcha mt-4">
          Pilih Menu
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="w-full">
      <div className="row g-4">
        <div className="col-12 col-lg-8">
          <div className="card-soft p-5 sm:p-6">
            <h2 className="text-base font-bold text-matcha-900">
              Konfirmasi Pesanan
            </h2>
            <p className="text-xs text-stone-500">
              Pilih diantar atau ambil sendiri, lalu lengkapi datanya.
            </p>

            <h3 className="mt-5 text-sm font-bold text-matcha-900">
              1. Jenis Pesanan
            </h3>
            <div className="mt-2 grid gap-3 sm:grid-cols-2">
              {orderTypes.map((o) => {
                const active = type === o.key;
                return (
                  <button
                    type="button"
                    key={o.key}
                    onClick={() => setType(o.key)}
                    aria-pressed={active}
                    className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all duration-300 ${
                      active
                        ? "border-matcha-700 bg-matcha-50 ring-1 ring-matcha-700"
                        : "border-matcha-200 bg-white hover:-translate-y-0.5 hover:border-matcha-500 hover:shadow-soft"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-lg transition-colors duration-300 ${
                        active
                          ? "bg-matcha-700 text-white"
                          : "bg-matcha-100 text-matcha-700"
                      }`}
                    >
                      <i className={`bi ${o.icon}`} />
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-matcha-900">
                        {o.title}
                      </span>
                      <span className="block text-xs text-stone-500">
                        {o.desc}
                      </span>
                      <span className="block text-xs font-semibold text-matcha-700">
                        {o.key === "antar"
                          ? `Ongkir flat ${rupiah(ONGKIR_FLAT)}`
                          : "Gratis ongkir"}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            <h3 className="mt-6 text-sm font-bold text-matcha-900">
              2. {antar ? "Alamat Pengiriman" : "Data Pengambilan"}
            </h3>
            <div key={type} className="row g-3 mt-0 animate-fade-up">
              <div className="col-12 col-md-6">
                <label className="label-matcha !text-xs" htmlFor="name">
                  {antar ? "Nama penerima" : "Nama pengambil"}
                </label>
                <input
                  id="name"
                  name="name"
                  required
                  className="input-matcha"
                  placeholder="Nama lengkap"
                  value={form.name}
                  onChange={onChange}
                />
              </div>
              <div className="col-12 col-md-6">
                <label className="label-matcha !text-xs" htmlFor="phone">
                  Nomor telepon
                </label>
                <input
                  id="phone"
                  name="phone"
                  required
                  type="tel"
                  className="input-matcha"
                  placeholder="08xxxxxxxxxx"
                  value={form.phone}
                  onChange={onChange}
                />
              </div>

              {antar ? (
                <>
                  <div className="col-12">
                    <label className="label-matcha !text-xs" htmlFor="address">
                      Alamat lengkap
                    </label>
                    <input
                      id="address"
                      name="address"
                      required
                      className="input-matcha"
                      placeholder="Jalan, nomor rumah, kota, kode pos"
                      value={form.address}
                      onChange={onChange}
                    />
                  </div>
                  <div className="col-12">
                    <div className="flex items-center justify-between rounded-xl border border-matcha-200 bg-matcha-50/60 px-4 py-3 text-sm">
                      <span className="text-stone-600">
                        <i className="bi bi-bicycle mr-2 text-matcha-700" />
                        Ongkir flat (berlaku untuk semua jarak)
                      </span>
                      <span className="font-bold text-matcha-700">
                        {rupiah(ONGKIR_FLAT)}
                      </span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="col-12 col-md-6">
                    <label className="label-matcha !text-xs" htmlFor="pickup">
                      Waktu ambil
                    </label>
                    <select
                      id="pickup"
                      className="input-matcha"
                      value={pickup}
                      onChange={(e) => setPickup(e.target.value)}
                    >
                      {pickupOptions.map((p) => (
                        <option key={p}>{p}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-12 col-md-6">
                    <div className="label-matcha !text-xs">Ambil di</div>
                    <div className="flex items-center gap-2 rounded-xl border border-matcha-200 bg-matcha-50/60 px-3.5 py-2.5 text-sm font-semibold text-matcha-900">
                      <i className="bi bi-geo-alt-fill text-matcha-700" />
                      {GERAI}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="col-12 col-lg-4">
          {!user && (
            <div className="mb-3 rounded-2xl border border-matcha-200 bg-matcha-50 p-4 text-xs text-stone-600">
              <div className="mb-1 text-sm font-bold text-matcha-900">
                <i className="bi bi-stars mr-1 text-matcha-700" />
                Dapat diskon {Math.round(DISKON_MEMBER * 100)}%
              </div>
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
              untuk diskon member dan menyimpan riwayat pesanan di akunmu. Kamu
              juga bisa lanjut tanpa akun, riwayat tetap tersimpan di perangkat
              ini.
            </div>
          )}
          <div className="card-soft p-5">
            <h3 className="text-sm font-bold text-matcha-900">Ringkasan</h3>
            <dl className="mt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-stone-500">{count} item pesanan</dt>
                <dd className="font-semibold">{rupiah(subtotal)}</dd>
              </div>
              {user && (
                <div className="flex justify-between">
                  <dt className="text-stone-500">
                    Diskon member ({Math.round(DISKON_MEMBER * 100)}%)
                  </dt>
                  <dd className="font-semibold text-matcha-700">
                    - {rupiah(diskon)}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-stone-500">Ongkir</dt>
                <dd className="font-semibold">
                  {antar ? (
                    rupiah(ongkir)
                  ) : (
                    <span className="text-matcha-700">Gratis</span>
                  )}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-stone-500">Jenis pesanan</dt>
                <dd className="font-semibold">
                  {antar ? "Diantar" : "Ambil sendiri"}
                </dd>
              </div>
            </dl>
            <div className="mt-4 flex items-center justify-between border-t border-matcha-100 pt-4">
              <span className="text-sm font-semibold text-matcha-900">
                Total pembayaran
              </span>
              <span className="text-lg font-extrabold text-matcha-700">
                {rupiah(total)}
              </span>
            </div>

            <div className="mt-4 text-xs font-semibold text-stone-600">
              Metode pembayaran
            </div>
            {/* [TUNAI] pilihan metode pembayaran (sebelumnya hanya QRIS) */}
            <div className="mt-1.5 grid gap-2">
              {[
                {
                  key: "qris",
                  icon: "bi-qr-code",
                  title: "QRIS / E-wallet",
                  desc: "Scan QR, bayar sekarang",
                },
                {
                  key: "transfer",
                  icon: "bi-bank",
                  title: "Transfer / Virtual Account",
                  desc: "Bayar lewat nomor VA bank",
                }, // [BARU]
                {
                  key: "tunai",
                  icon: "bi-cash-coin",
                  title: "Tunai",
                  desc: antar
                    ? "Bayar ke kurir saat pesanan tiba"
                    : "Bayar di gerai saat ambil",
                },
              ].map((m) => {
                const active = payMethod === m.key;
                return (
                  <button
                    type="button"
                    key={m.key}
                    onClick={() => setPayMethod(m.key)}
                    aria-pressed={active}
                    className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-all ${
                      active
                        ? "border-matcha-700 bg-matcha-50 ring-1 ring-matcha-700"
                        : "border-matcha-200 bg-white hover:border-matcha-500"
                    }`}
                  >
                    <i className={`bi ${m.icon} text-lg text-matcha-700`} />
                    <span>
                      <span className="block font-semibold text-matcha-900">
                        {m.title}
                      </span>
                      <span className="block text-xs text-stone-500">
                        {m.desc}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* [BARU] pilih bank kalau metode Transfer / VA */}
            {payMethod === "transfer" && (
              <div className="mt-2">
                <label className="label-matcha !text-xs" htmlFor="bank">
                  Bank
                </label>
                <select
                  id="bank"
                  className="input-matcha"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                >
                  {BANKS.map((b) => (
                    <option key={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}

            {error && (
              <div
                className="mt-3 rounded-xl bg-red-50 px-3 py-2 text-xs text-red-700"
                role="alert"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-matcha mt-4 w-full"
            >
              {loading
                ? "Memproses..."
                : tunai
                  ? "Buat Pesanan"
                  : "Buat Pesanan & Bayar"}{" "}
              {/* [TUNAI] */}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
