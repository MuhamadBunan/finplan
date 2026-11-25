import { useRef } from 'react'
import { format } from 'date-fns'
import { useStore } from '../store/useStore'

export default function SettingsPage() {
  const { transactions, budgets, theme, profile, setTheme, setProfile, importData, reset, notify } = useStore()
  const file = useRef()
  const exportJson = () => {
    const blob = new Blob([JSON.stringify({ transactions, budgets, theme, profile }, null, 2)], { type: 'application/json' })
    const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: `finplan-backup-${format(new Date(), 'yyyyMMdd')}.json` })
    a.click(); URL.revokeObjectURL(a.href); notify('Data diekspor')
  }
  const onImport = async (e) => {
    const f = e.target.files[0]; if (!f) return
    try {
      const d = JSON.parse(await f.text())
      if (!Array.isArray(d.transactions)) throw new Error()
      if (confirm('Impor akan menimpa data saat ini. Lanjutkan?')) { importData(d); notify('Data diimpor') }
    } catch { notify('File tidak valid') }
    e.target.value = ''
  }
  const doReset = () => { if (confirm('Hapus SEMUA data? Tindakan ini tidak dapat dibatalkan.')) { reset(); notify('Data direset') } }
  return (
    <div className="max-w-xl space-y-4">
      <div className="card space-y-3">
        <label className="block text-sm">Nama<input className="input mt-1" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
        <label className="block text-sm">Tema
          <select className="input mt-1" value={theme} onChange={(e) => setTheme(e.target.value)}><option value="light">Light</option><option value="dark">Dark</option></select></label>
        <div className="text-sm text-stone-500">Mata uang: IDR. Format tanggal: dd/MM/yyyy.</div>
      </div>
      <div className="card flex flex-wrap gap-2">
        <button className="btn" onClick={exportJson}>Ekspor / backup JSON</button>
        <button className="btn-ghost" onClick={() => file.current.click()}>Impor / restore JSON</button>
        <input ref={file} type="file" accept="application/json" hidden onChange={onImport} />
        <button className="btn-ghost !text-red-600" onClick={doReset}>Reset semua data</button>
      </div>
    </div>
  )
}
