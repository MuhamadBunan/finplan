export const INCOME_CATS = ['Gaji', 'Freelance', 'Business Income', 'Bonus', 'Investment Income', 'Passive Income', 'Other Income']
export const EXPENSE_GROUPS = {
  'Kebutuhan pokok': ['Makanan', 'Tempat tinggal', 'Transportasi', 'Listrik dan air', 'Internet dan komunikasi'],
  'Kebutuhan pribadi': ['Pakaian', 'Kesehatan', 'Hiburan', 'Pendidikan', 'Perawatan pribadi'],
  Keuangan: ['Tabungan', 'Investasi', 'Cicilan', 'Asuransi', 'Dana darurat'],
  Lainnya: ['Sosial dan donasi', 'Keluarga', 'Pengeluaran tidak terduga', 'Custom Category'],
}
export const EXPENSE_CATS = Object.values(EXPENSE_GROUPS).flat()
export const METHODS = ['Tunai', 'Transfer bank', 'Kartu debit', 'Kartu kredit', 'E-wallet']
export const RULE = {
  needs: ['Makanan', 'Tempat tinggal', 'Transportasi', 'Listrik dan air', 'Internet dan komunikasi', 'Cicilan', 'Asuransi'],
  wants: ['Pakaian', 'Kesehatan', 'Hiburan', 'Pendidikan', 'Perawatan pribadi', 'Sosial dan donasi', 'Keluarga', 'Pengeluaran tidak terduga', 'Custom Category'],
  savings: ['Tabungan', 'Investasi', 'Dana darurat'],
}
