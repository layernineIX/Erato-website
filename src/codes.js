/* ERATO discount codes. Server-side only: not visible to visitors.
   type: 'percent' or 'amount' (USD off). Optional: min (min. bag subtotal, USD), expires ('YYYY-MM-DD'),
   uses: total times the code can be used (omit = unlimited), perEmail: true = each email can use it once. */
export const CODES = {
  /* First-time buyers: public code, one use per email address */
  'EN10': { type: 'percent', value: 10, label: '10% off', perEmail: true },

  /* Friends: 15% off, each code works once. Give one code per friend. */
  'EF-S5C567': { type: 'percent', value: 15, label: '15% off', uses: 1 },
  'EF-FVGDQ2': { type: 'percent', value: 15, label: '15% off', uses: 1 },
  'EF-EEK7EX': { type: 'percent', value: 15, label: '15% off', uses: 1 },
  'EF-PEB6BM': { type: 'percent', value: 15, label: '15% off', uses: 1 },
  'EF-BSHGCH': { type: 'percent', value: 15, label: '15% off', uses: 1 },
  'EF-4SFKE2': { type: 'percent', value: 15, label: '15% off', uses: 1 },
  'EF-ZCRX6F': { type: 'percent', value: 15, label: '15% off', uses: 1 },
  'EF-ZP5GCX': { type: 'percent', value: 15, label: '15% off', uses: 1 },
  'EF-TS3W8N': { type: 'percent', value: 15, label: '15% off', uses: 1 },
  'EF-XF4H4T': { type: 'percent', value: 15, label: '15% off', uses: 1 },
};
