import { useState, useMemo } from 'react'
import { format } from 'date-fns'
import { Pencil, Trash2, Plus } from 'lucide-react'
import { useStore } from '../store/useStore'
import { INCOME_CATS, EXPENSE_CATS, METHODS } from '../constants/categories'
import { idr } from '../utils/format'
import Empty from '../components/ui/Empty'

const blank = () => ({ type: 'expense', amount: '', category: EXPENSE_CATS[0], date: format(new Date(), 'yyyy-MM-dd'), note: '', method: METHODS[0], recurring: false, fixed: true })

export default function Transactions() {
  const { transactions, month, addTx, updateTx, removeTx, notify } = useStore()
  const [form, setForm] = useState(blank())
  const [editId, setEditId] = useState(null)
  const [err, setErr] = useState({})
  const [q, setQ] = useState('')
  const [fType, setFType] = useState('all')
  const [fCat, setFCat] = useState('all')
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const cats = form.type === 'income' ? INCOME_CATS : EXPENSE_CATS

  const submit = (e) => {
    e.preventDefault()
    const er = {}
    const amount = Number(form.amount)
    if (!(amount > 0)) er.amount = 'Nominal harus lebih dari 0'
    if (!form.date) er.date = 'Tanggal wajib diisi'
    setErr(er)
    if (Object.keys(er).length) return
    const data = { ...form, amount }
    if (editId) { updateTx(editId, data); notify('Transaksi diperbarui') } else { addTx(data); notify('Transaksi ditambahkan') }
    setForm(blank()); setEditId(null)
  }
  const edit = (t) => { setForm({ ...t, amount: String(t.amount) }); setEditId(t.id); window.scrollTo({ top: 0, behavior: 'smooth' }) }
  const del = (t) => { if (confirm('Hapus transaksi ini?')) { removeTx(t.id); notify('Transaksi dihapus') } }

  const rows = useMemo(() => transactions
    .filter((t) => t.date.slice(0, 7) === month)
    .filter((t) => fType === 'all' || t.type === fType)
    .filter((t) => fCat === 'all' || t.category === fCat)
    .filter((t) => !q || `${t.note} ${t.category}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => b.date.localeCompare(a.date)), [transactions, month, fType, fCat, q])

  return (
    <div className="space-y-4">
      <form onSubmit={submit} className="card grid gap-3 sm:grid-cols-2 lg:grid-cols-4" noValidate>
        <label className="text-sm">Jenis
          <select className="input mt-1" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value, category: (e.target.value === 'income' ? INCOME_CATS : EXPENSE_CATS)[0] })}>
            <option value="expense">Pengeluaran</option><option value="income">Pemasukan</option></select></label>
        <label className="text-sm">Nominal (IDR)
          <input className="input mt-1" type="number" min="0" value={form.amount} onChange={(e) => set('amount', e.target.value)} />
          {err.amount && <span className="text-xs text-red-600">{err.amount}</span>}</label>
        <label className="text-sm">Kategori
          <select className="input mt-1" value={form.category} onChange={(e) => set('category', e.target.value)}>{cats.map((c) => <option key={c}>{c}</option>)}</select></label>
        <label className="text-sm">Tanggal
          <input className="input mt-1" type="date" value={form.date} onChange={(e) => set('date', e.target.value)} />
          {err.date && <span className="text-xs text-red-600">{err.date}</span>}</label>
        {form.type === 'expense' && <label className="text-sm">Metode pembayaran
          <select className="input mt-1" value={form.method} onChange={(e) => set('method', e.target.value)}>{METHODS.map((m) => <option key={m}>{m}</option>)}</select></label>}
        <label className="text-sm sm:col-span-2">Catatan
          <input className="input mt-1" value={form.note} onChange={(e) => set('note', e.target.value)} /></label>
        <label className="flex items-center gap-2 text-sm">
          {form.type === 'expense'
            ? <><input type="checkbox" checked={form.recurring} onChange={(e) => set('recurring', e.target.checked)} /> Berulang (recurring)</>
            : <><input type="checkbox" checked={form.fixed} onChange={(e) => set('fixed', e.target.checked)} /> Pemasukan tetap</>}
        </label>
        <div className="flex gap-2 sm:col-span-2 lg:col-span-4">
          <button className="btn" type="submit"><Plus size={16} />{editId ? 'Simpan perubahan' : 'Tambah transaksi'}</button>
          {editId && <button type="button" className="btn-ghost" onClick={() => { setForm(blank()); setEditId(null) }}>Batal</button>}
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        <input className="input !w-56" placeholder="Cari catatan/kategori" value={q} onChange={(e) => setQ(e.target.value)} />
        <select className="input !w-40" value={fType} onChange={(e) => setFType(e.target.value)}><option value="all">Semua jenis</option><option value="income">Pemasukan</option><option value="expense">Pengeluaran</option></select>
        <select className="input !w-52" value={fCat} onChange={(e) => setFCat(e.target.value)}><option value="all">Semua kategori</option>{[...INCOME_CATS, ...EXPENSE_CATS].map((c) => <option key={c}>{c}</option>)}</select>
      </div>

      {rows.length === 0 ? <Empty>Tidak ada transaksi pada bulan ini dengan filter tersebut.</Empty> : (
        <div className="card overflow-x-auto !p-0">
          <table className="w-full text-sm">
            <thead className="text-left text-xs text-stone-500"><tr><th className="p-3">Tanggal</th><th>Kategori</th><th>Catatan</th><th className="text-right">Nominal</th><th></th></tr></thead>
            <tbody>{rows.map((t) => (
              <tr key={t.id} className="border-t border-stone-200 dark:border-stone-800">
                <td className="p-3 whitespace-nowrap">{format(new Date(t.date), 'dd/MM/yyyy')}</td>
                <td>{t.category}{t.recurring && <span className="ml-2 text-xs text-stone-500">berulang</span>}</td>
                <td className="text-stone-500">{t.note}</td>
                <td className={`text-right font-medium ${t.type === 'income' ? 'text-emerald-700' : ''}`}>{t.type === 'income' ? '+' : '-'}{idr(t.amount)}</td>
                <td className="whitespace-nowrap p-3 text-right">
                  <button aria-label="Edit" className="p-1" onClick={() => edit(t)}><Pencil size={15} /></button>
                  <button aria-label="Hapus" className="p-1 text-red-600" onClick={() => del(t)}><Trash2 size={15} /></button></td>
              </tr>))}</tbody>
          </table>
        </div>)}
    </div>
  )
}
