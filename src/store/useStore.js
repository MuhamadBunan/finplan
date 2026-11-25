import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { format } from 'date-fns'
import { uid } from '../utils/format'

const initial = { transactions: [], budgets: {}, theme: 'light', profile: { name: '' } }

export const useStore = create(
  persist(
    (set) => ({
      ...initial,
      month: format(new Date(), 'yyyy-MM'),
      toast: null,
      notify: (msg) => { set({ toast: msg }); setTimeout(() => set({ toast: null }), 2500) },
      setMonth: (month) => set({ month }),
      addTx: (t) => set((s) => ({ transactions: [{ ...t, id: uid() }, ...s.transactions] })),
      updateTx: (id, t) => set((s) => ({ transactions: s.transactions.map((x) => (x.id === id ? { ...t, id } : x)) })),
      removeTx: (id) => set((s) => ({ transactions: s.transactions.filter((x) => x.id !== id) })),
      setBudgets: (budgets) => set({ budgets }),
      setTheme: (theme) => set({ theme }),
      setProfile: (profile) => set({ profile }),
      importData: (d) => set({ transactions: d.transactions || [], budgets: d.budgets || {}, theme: d.theme || 'light', profile: d.profile || initial.profile }),
      reset: () => set({ ...initial }),
    }),
    { name: 'finplan-v1', partialize: (s) => ({ transactions: s.transactions, budgets: s.budgets, theme: s.theme, profile: s.profile }) }
  )
)
