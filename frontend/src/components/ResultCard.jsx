// Category → icon & accent color mapping for visual richness
const CATEGORY_META = {
  Electronics: { icon: '💻', color: 'bg-blue-50 text-blue-800 border-blue-200' },
  Clothing: { icon: '👕', color: 'bg-violet-50 text-violet-800 border-violet-200' },
  Books: { icon: '📚', color: 'bg-amber-50 text-amber-800 border-amber-200' },
  'Home & Kitchen': { icon: '🏠', color: 'bg-teal-50 text-teal-800 border-teal-200' },
  Sports: { icon: '⚽', color: 'bg-green-50 text-green-800 border-green-200' },
  Toys: { icon: '🧸', color: 'bg-pink-50 text-pink-800 border-pink-200' },
  Beauty: { icon: '💄', color: 'bg-rose-50 text-rose-800 border-rose-200' },
  Automotive: { icon: '🚗', color: 'bg-orange-50 text-orange-800 border-orange-200' },
  Food: { icon: '🛒', color: 'bg-lime-50 text-lime-800 border-lime-200' },
  Health: { icon: '💊', color: 'bg-cyan-50 text-cyan-800 border-cyan-200' },
}

const DEFAULT_META = { icon: '📦', color: 'bg-slate-100 text-slate-800 border-slate-200' }

function ConfidenceBar({ value }) {
  const pct = Math.round(value * 100)
  const barColor =
    pct >= 80 ? 'bg-emerald-500' : pct >= 55 ? 'bg-amber-400' : 'bg-red-400'

  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Confidence</span>
        <span className="text-sm font-semibold text-slate-800">{pct.toFixed(1)}%</span>
      </div>
      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${barColor}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-slate-400">
        {pct >= 80 ? 'High confidence' : pct >= 55 ? 'Moderate confidence' : 'Low confidence — review recommended'}
      </p>
    </div>
  )
}

export default function ResultCard({ result, onReset }) {
  if (!result) return null

  const { prediction, confidence } = result
  const meta = CATEGORY_META[prediction] ?? DEFAULT_META

  return (
    <div className="result-appear bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
      {/* Top stripe */}
      <div className="h-1 bg-gradient-to-r from-slate-800 via-slate-600 to-slate-400" />

      <div className="p-6 space-y-5">
        {/* Header row */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
              Classification Result
            </p>
            <h2 className="text-lg font-semibold text-slate-900">Analysis Complete</h2>
          </div>
          <button
            onClick={onReset}
            className="text-xs text-slate-400 hover:text-slate-700 border border-slate-200 hover:border-slate-300 rounded-lg px-3 py-1.5 transition-all duration-150 font-medium"
          >
            Clear & Reset
          </button>
        </div>

        {/* Divider */}
        <div className="border-t border-slate-100" />

        {/* Category badge */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Predicted Category
          </p>
          <div className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold ${meta.color}`}>
            <span className="text-base leading-none">{meta.icon}</span>
            <span>{prediction}</span>
          </div>
        </div>

        {/* Confidence bar */}
        <ConfidenceBar value={confidence} />

        {/* Metadata footer */}
        <div className="pt-2 border-t border-slate-100">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Multi-modal classification — text + image features combined
          </div>
        </div>
      </div>
    </div>
  )
}
