import { useState } from 'react'
import { useStore } from '../store/useStore'
import { EXPENSE_CATS, RULE } from '../constants/categories'
import { budgetStatus, summary, applyRule5030 } from '../calculations/finance'
import { idr, pct } from '../utils/format'
import Empty from '../components/ui/Empty'

export default function Budget() {
  const { budgets, setBudgets, transactions, month, notify } = useStore()
  const [cat, setCat] = useState(EXPENSE_CATS[0])
  const [limit, setLimit] = useState('')
  const [income, setIncome] = useState('')
  const status = budgetStatus(budgets, transactions, month)
  const monthIncome = summary(transactions, month).income

  const add = (e) => {
    e.preventDefault()
    if (!(Number(limit) > 0)) return notify('Batas anggaran harus lebih dari 0')
    setBudgets({ ...budgets, [cat]: Number(limit) }); setLimit(''); notify('Anggaran disimpan')
  }
  const rule = () => {
    const base = Number(income) || monthIncome
    if (!(base > 0)) return notify('Isi pendapatan atau catat pemasukan bulan ini dulu')
    setBudgets(applyRule5030(base, RULE)); notify('Anggaran 50/30/20 diterapkan')
  }
  const remove = (c) => { const rest = { ...budgets }; delete rest[c]; setBudgets(rest); notify('Anggaran dihapus') }
  const color = { ok: 'bg-emerald-600', warn: 'bg-amber-500', over: 'bg-red-600' }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 lg:grid-cols-2">
        <form onSubmit={add} className="card flex flex-wrap items-end gap-3">
          <label className="flex-1 text-sm">Kategori<select className="input mt-1" value={cat} onChange={(e) => setCat(e.target.value)}>{EXPENSE_CATS.map((c) => <option key={c}>{c}</option>)}</select></label>
          <label className="flex-1 text-sm">Batas bulanan<input className="input mt-1" type="number" min="0" value={limit} onChange={(e) => setLimit(e.target.value)} /></label>
          <button className="btn" type="submit">Simpan anggaran</button>
        </form>
        <div className="card flex flex-wrap items-end gap-3">
          <label className="flex-1 text-sm">Pendapatan untuk 50/30/20<input className="input mt-1" type="number" placeholder={monthIncome ? `Default: ${idr(monthIncome)}` : 'Nominal'} value={income} onChange={(e) => setIncome(e.target.value)} /></label>
          <button className="btn-ghost" onClick={rule}>Terapkan 50/30/20</button>
        </div>
      </div>
      {status.length === 0 ? <Empty>Belum ada anggaran. Tambahkan batas per kategori atau terapkan aturan 50/30/20.</Empty> : (
        <div className="space-y-3">{status.map((b) => (
          <div key={b.category} className="card">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{b.category}</span>
              <span>{idr(b.used)} / {idr(b.limit)} ({pct(b.percent)})</span>
            </div>
            <div className="mt-2 h-2 rounded bg-stone-200 dark:bg-stone-800"><div className={`h-2 rounded ${color[b.state]}`} style={{ width: `${Math.min(b.percent, 100)}%` }} /></div>
            <div className="mt-2 flex justify-between text-xs text-stone-500">
              <span>{b.state === 'over' ? `Melewati batas ${idr(-b.remaining)}` : b.state === 'warn' ? `Mendekati batas, sisa ${idr(b.remaining)}` : `Sisa ${idr(b.remaining)}`}</span>
              <button className="text-red-600" onClick={() => remove(b.category)}>Hapus</button>
            </div>
          </div>))}</div>)}
    </div>
  )
}
