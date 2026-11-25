export const idr = (n) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n || 0)
export const pct = (n) => `${(n || 0).toFixed(1)}%`
export const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random()))
