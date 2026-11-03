import { useMemo, useState } from 'react'
import Section from '../components/Section'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'
import { kategoriProduk, produkAwal } from '../data/adminData'
import { rupiah } from '../../shared/utils/format'

const kosong = { name: '', kategori: 'Matcha', harga: '', varian: 'S / M / L', stok: '' }

const hitungStatus = (stok) => (stok <= 0 ? 'Habis' : stok < 70 ? 'Menipis' : 'Aktif')

export default function ProdukPage() {
  const [produk, setProduk] = useState(produkAwal)
  const [filter, setFilter] = useState('Semua kategori')
  const [modal, setModal] = useState(null) // null | { mode: 'tambah' | 'edit', data }

  const tampil = useMemo(
    () => (filter === 'Semua kategori' ? produk : produk.filter((p) => p.kategori === filter)),
    [produk, filter],
  )

  const aktif = produk.filter((p) => p.status === 'Aktif').length
  const perhatian = produk.filter((p) => p.status !== 'Aktif').length

  const simpan = (e) => {
    e.preventDefault()
    const d = { ...modal.data, harga: Number(modal.data.harga), stok: Number(modal.data.stok) }
    d.status = hitungStatus(d.stok)
    setProduk((list) =>
      modal.mode === 'edit'
        ? list.map((p) => (p.id === d.id ? d : p))
        : [...list, { ...d, id: Date.now() }],
    )
    setModal(null)
  }

  const setField = (k, v) => setModal((m) => ({ ...m, data: { ...m.data, [k]: v } }))

  return (
    <div className="w-full">
      <div className="card-soft p-5">
        <Section
          title="Daftar Produk"
          desc="Kini informasi menu yang tersedia di katalog penjual."
          action={
            <button className="btn-matcha" onClick={() => setModal({ mode: 'tambah', data: kosong })}>
              <i className="bi bi-plus-lg" /> Tambah Produk
            </button>
          }
        />

        <div className="row g-3 mb-4">
          <div className="col-12 col-md-4">
            <StatCard label="Total produk" value={produk.length} note={`${kategoriProduk.length} kategori`} tone="muted" />
          </div>
          <div className="col-12 col-md-4">
            <StatCard label="Produk aktif" value={aktif} note={`${Math.round((aktif / (produk.length || 1)) * 100)}%`} />
          </div>
          <div className="col-12 col-md-4">
            <StatCard label="Stok perlu perhatian" value={perhatian} note="Perhatian" tone="warn" icon="bi-exclamation" />
          </div>
        </div>

        <div className="mb-3 flex items-center gap-3">
          <span className="text-xs text-stone-500">Filter kategori</span>
          <select
            className="form-select form-select-sm !w-auto !rounded-lg"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option>Semua kategori</option>
            {kategoriProduk.map((k) => (
              <option key={k}>{k}</option>
            ))}
          </select>
        </div>

        <div className="table-responsive">
          <table className="table table-matcha table-hover align-middle">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga mulai</th>
                <th>Varian</th>
                <th>Stok</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {tampil.map((p) => (
                <tr key={p.id}>
                  <td className="font-semibold text-matcha-900">{p.name}</td>
                  <td>{p.kategori}</td>
                  <td>{rupiah(p.harga)}</td>
                  <td>{p.varian}</td>
                  <td>{p.stok}</td>
                  <td>
                    <StatusBadge status={p.status} />
                  </td>
                  <td>
                    <button
                      className="text-xs font-semibold text-matcha-700 hover:underline"
                      onClick={() => setModal({ mode: 'edit', data: p })}
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
              {tampil.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-stone-400">
                    Belum ada produk di kategori ini.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Bootstrap (tanpa JS Bootstrap, dikontrol lewat state React) */}
      {modal && (
        <div className="modal d-block" style={{ background: 'rgba(31,61,26,.45)' }} onClick={() => setModal(null)}>
          <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
            <form className="modal-content !rounded-2xl border-0 p-2" onSubmit={simpan}>
              <div className="modal-header border-0 pb-0">
                <h5 className="modal-title !text-base !font-bold text-matcha-900">
                  {modal.mode === 'edit' ? 'Edit Produk' : 'Tambah Produk'}
                </h5>
                <button type="button" className="btn-close" aria-label="Tutup" onClick={() => setModal(null)} />
              </div>
              <div className="modal-body space-y-3">
                <div>
                  <label className="label-matcha !text-xs">Nama produk</label>
                  <input required className="input-matcha" value={modal.data.name} onChange={(e) => setField('name', e.target.value)} />
                </div>
                <div className="row g-3">
                  <div className="col-6">
                    <label className="label-matcha !text-xs">Kategori</label>
                    <select className="input-matcha" value={modal.data.kategori} onChange={(e) => setField('kategori', e.target.value)}>
                      {kategoriProduk.map((k) => (
                        <option key={k}>{k}</option>
                      ))}
                    </select>
                  </div>
                  <div className="col-6">
                    <label className="label-matcha !text-xs">Varian</label>
                    <input className="input-matcha" value={modal.data.varian} onChange={(e) => setField('varian', e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="label-matcha !text-xs">Harga mulai (Rp)</label>
                    <input required type="number" min="0" className="input-matcha" value={modal.data.harga} onChange={(e) => setField('harga', e.target.value)} />
                  </div>
                  <div className="col-6">
                    <label className="label-matcha !text-xs">Stok</label>
                    <input required type="number" min="0" className="input-matcha" value={modal.data.stok} onChange={(e) => setField('stok', e.target.value)} />
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn-outline-matcha" onClick={() => setModal(null)}>
                  Batal
                </button>
                <button type="submit" className="btn-matcha">
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
