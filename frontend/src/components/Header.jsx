import { useEffect, useState } from 'react'

export default function Header() {
  const [health, setHealth] = useState('loading') // 'ok' | 'error' | 'loading'

  useEffect(() => {
    const check = async () => {
      try {
        const res = await fetch('/health')
        if (res.ok) {
          setHealth('ok')
        } else {
          setHealth('error')
        }
      } catch {
        setHealth('error')
      }
    }

    check()
    const interval = setInterval(check, 15000)
    return () => clearInterval(interval)
  }, [])

  return (
    <header className="w-full bg-white border-b border-slate-200 px-6 py-4">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-slate-900 rounded flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity="0.9"/>
              <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
              <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity="0.6"/>
              <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity="0.3"/>
            </svg>
          </div>
          <div>
            <h1 className="text-sm font-semibold text-slate-900 tracking-tight">
              Product Catalog Utility
            </h1>
            <p className="text-xs text-slate-400 mt-0.5 hidden sm:block">
              Multi-modal product classification
            </p>
          </div>
        </div>

        {/* API Status */}
        <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-full px-3 py-1.5">
          {health === 'loading' && (
            <>
              <span className="w-2 h-2 rounded-full bg-slate-300 animate-pulse" />
              <span className="text-xs text-slate-400 font-medium">Connecting…</span>
            </>
          )}
          {health === 'ok' && (
            <>
              <span className="w-2 h-2 rounded-full bg-emerald-500 health-dot-ok" />
              <span className="text-xs text-emerald-600 font-medium">API Online</span>
            </>
          )}
          {health === 'error' && (
            <>
              <span className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-xs text-red-500 font-medium">API Offline</span>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
