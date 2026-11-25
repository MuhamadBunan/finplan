import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { LayoutDashboard, ArrowLeftRight, PiggyBank, Settings, Menu } from 'lucide-react'
import { useStore } from '../../store/useStore'

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/transactions', label: 'Transactions', icon: ArrowLeftRight },
  { to: '/budget', label: 'Budget', icon: PiggyBank },
  { to: '/settings', label: 'Settings', icon: Settings },
]

export default function Layout() {
  const { month, setMonth, theme, toast } = useStore()
  const [open, setOpen] = useState(false)
  const loc = useLocation()
  useEffect(() => { document.documentElement.classList.toggle('dark', theme === 'dark') }, [theme])
  useEffect(() => setOpen(false), [loc.pathname])
  const title = links.find((l) => l.to === loc.pathname)?.label || 'FinPlan'
  return (
    <div className="min-h-screen md:flex">
      <aside className={`${open ? 'block' : 'hidden'} md:block w-full md:w-56 shrink-0 border-r border-stone-200 bg-white p-4 dark:border-stone-800 dark:bg-stone-900 md:min-h-screen`}>
        <div className="mb-6 text-lg font-bold text-emerald-700">FinPlan</div>
        <nav className="space-y-1">
          {links.map(({ to, label, icon: Icon }) => (
            <NavLink key={to} to={to} end className={({ isActive }) => `flex items-center gap-2 rounded-lg px-3 py-2 text-sm ${isActive ? 'bg-emerald-50 font-semibold text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300' : 'hover:bg-stone-100 dark:hover:bg-stone-800'}`}>
              <Icon size={16} />{label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="flex items-center gap-3 border-b border-stone-200 bg-white px-4 py-3 dark:border-stone-800 dark:bg-stone-900">
          <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(!open)}><Menu size={20} /></button>
          <h1 className="text-lg font-semibold">{title}</h1>
          <input type="month" className="input ml-auto !w-auto" value={month} onChange={(e) => e.target.value && setMonth(e.target.value)} aria-label="Filter bulan" />
        </header>
        <main className="mx-auto max-w-6xl p-4"><Outlet /></main>
      </div>
      {toast && <div role="status" className="fixed bottom-4 right-4 rounded-lg bg-stone-900 px-4 py-2 text-sm text-white shadow-lg">{toast}</div>}
    </div>
  )
}
