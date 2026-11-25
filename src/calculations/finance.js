import { format, subMonths, getDaysInMonth, getDate, parseISO } from 'date-fns'

export const ym = (d) => d.slice(0, 7)
export const sumBy = (list, type) => list.filter((t) => t.type === type).reduce((s, t) => s + t.amount, 0)
export const inMonth = (tx, month) => tx.filter((t) => ym(t.date) === month)

export function summary(tx, month) {
  const m = inMonth(tx, month)
  const income = sumBy(m, 'income')
  const expense = sumBy(m, 'expense')
  const savings = income - expense
  return { income, expense, savings, savingRate: income > 0 ? (savings / income) * 100 : 0, expenseRatio: income > 0 ? (expense / income) * 100 : 0 }
}

export function byCategory(tx, month) {
  const map = {}
  inMonth(tx, month).filter((t) => t.type === 'expense').forEach((t) => { map[t.category] = (map[t.category] || 0) + t.amount })
  return Object.entries(map).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)
}

export function monthlySeries(tx, month, n = 6) {
  const base = parseISO(`${month}-01`)
  return Array.from({ length: n }, (_, i) => {
    const key = format(subMonths(base, n - 1 - i), 'yyyy-MM')
    const s = summary(tx, key)
    return { month: key, label: format(parseISO(`${key}-01`), 'MMM yy'), income: s.income, expense: s.expense, cashflow: s.savings }
  })
}

export function budgetStatus(budgets, tx, month) {
  const spent = Object.fromEntries(byCategory(tx, month).map((c) => [c.name, c.value]))
  return Object.entries(budgets).map(([category, limit]) => {
    const used = spent[category] || 0
    const percent = limit > 0 ? (used / limit) * 100 : 0
    return { category, limit, used, percent, remaining: limit - used, state: percent > 100 ? 'over' : percent >= 80 ? 'warn' : 'ok' }
  })
}

export function projectedMonthEnd(tx, month, today = new Date()) {
  const s = summary(tx, month)
  if (month !== format(today, 'yyyy-MM')) return s.savings
  const day = Math.max(getDate(today), 1)
  return s.income - (s.expense / day) * getDaysInMonth(today)
}

export function applyRule5030(income, ruleMap, ratios = [0.5, 0.3, 0.2]) {
  const out = {}
  ;[ruleMap.needs, ruleMap.wants, ruleMap.savings].forEach((cats, i) => {
    const each = Math.round((income * ratios[i]) / cats.length)
    cats.forEach((c) => { out[c] = each })
  })
  return out
}
