import { Link } from 'react-router-dom'
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts'
import { useStore } from '../store/useStore'
import { summary, byCategory, monthlySeries, budgetStatus, projectedMonthEnd } from '../calculations/finance'
import { idr, pct } from '../utils/format'
import Empty from '../components/ui/Empty'

const COLORS = ['#047857', '#0e7490', '#b45309', '#7c3aed', '#be123c', '#4d7c0f', '#475569', '#a16207']

export default function Dashboard() {
  const { transactions, budgets, month } = useStore()
  const s = summary(transactions, month)
  const cats = byCategory(transactions, month)
  const series = monthlySeries(transactions, month)
  const bs = budgetStatus(budgets, transactions, month)
  const over = bs.filter((b) => b.state === 'over')
  const prev = series[series.length - 2]
  if (!transactions.length) return <Empty>Belum ada data. <Link className="text-emerald-700 underline" to="/transactions">Catat transaksi pertama</Link> untuk melihat ringkasan.</Empty>

  const cards = [['Total Income', idr(s.income)], ['Total Expenses', idr(s.expense)], ['Monthly Savings', idr(s.savings)], ['Saving Rate', pct(s.savingRate)]]
  const insights = [
    `Pengeluaran ${pct(s.expenseRatio)} dari pendapatan bulan ini.`,
    cats[0] ? `Kategori terbesar: ${cats[0].name} (${idr(cats[0].value)}).` : 'Belum ada pengeluaran bulan ini.',
    prev ? `Arus kas bulan lalu: ${idr(prev.cashflow)}.` : '',
    bs.length ? (over.length ? `Melewati anggaran: ${over.map((o) => o.category).join(', ')}.` : 'Semua kategori masih dalam batas anggaran.') : 'Anggaran belum diatur.',
    `Proyeksi saldo akhir bulan: ${idr(projectedMonthEnd(transactions, month))}.`,
  ].filter(Boolean)
  const axis = (v) => `${v / 1e6}jt`

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {cards.map(([l, v]) => <div key={l} className="card"><div className="text-xs text-stone-500">{l}</div><div className="mt-1 text-lg font-semibold">{v}</div></div>)}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card h-72"><div className="mb-2 text-sm font-semibold">Income vs Expenses</div>
          <ResponsiveContainer width="100%" height="90%"><BarChart data={series}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="label" fontSize={12} /><YAxis fontSize={11} tickFormatter={axis} /><Tooltip formatter={idr} /><Legend /><Bar dataKey="income" name="Pemasukan" fill="#047857" /><Bar dataKey="expense" name="Pengeluaran" fill="#b45309" /></BarChart></ResponsiveContainer></div>
        <div className="card h-72"><div className="mb-2 text-sm font-semibold">Monthly Cash Flow</div>
          <ResponsiveContainer width="100%" height="90%"><LineChart data={series}><CartesianGrid strokeDasharray="3 3" opacity={0.3} /><XAxis dataKey="label" fontSize={12} /><YAxis fontSize={11} tickFormatter={axis} /><Tooltip formatter={idr} /><Line dataKey="cashflow" name="Arus kas" stroke="#0e7490" strokeWidth={2} /></LineChart></ResponsiveContainer></div>
        <div className="card h-72"><div className="mb-2 text-sm font-semibold">Pengeluaran per kategori</div>
          {cats.length ? <ResponsiveContainer width="100%" height="90%"><PieChart><Pie data={cats} dataKey="value" nameKey="name" outerRadius={80}>{cats.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}</Pie><Tooltip formatter={idr} /><Legend /></PieChart></ResponsiveContainer> : <Empty>Belum ada pengeluaran bulan ini.</Empty>}</div>
        <div className="card"><div className="mb-2 text-sm font-semibold">Quick Insights</div><ul className="list-disc space-y-2 pl-5 text-sm">{insights.map((i) => <li key={i}>{i}</li>)}</ul></div>
      </div>
    </div>
  )
}
