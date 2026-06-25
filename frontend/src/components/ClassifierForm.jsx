import { useState } from 'react'
import ImageDropzone from './ImageDropzone'
import ResultCard from './ResultCard'

const INITIAL_FORM = { title: '', description: '' }

export default function ClassifierForm() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [image, setImage] = useState(null)
  const [status, setStatus] = useState('idle') // idle | loading | success | error
  const [result, setResult] = useState(null)
  const [errorMsg, setErrorMsg] = useState('')

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleReset = () => {
    setForm(INITIAL_FORM)
    setImage(null)
    setStatus('idle')
    setResult(null)
    setErrorMsg('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.title.trim()) {
      setErrorMsg('Product title is required.')
      setStatus('error')
      return
    }
    if (!image) {
      setErrorMsg('Please upload a product image.')
      setStatus('error')
      return
    }

    setStatus('loading')
    setErrorMsg('')
    setResult(null)

    try {
      const fd = new FormData()
      fd.append('title', form.title.trim())
      fd.append('description', form.description.trim())
      fd.append('image', image)

      const res = await fetch('/predict', { method: 'POST', body: fd })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data?.detail || `Server returned ${res.status}`)
      }

      const data = await res.json()
      setResult(data)
      setStatus('success')
    } catch (err) {
      setErrorMsg(err.message || 'An unexpected error occurred.')
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-6xl mx-auto w-full">
      {/* ── Left column: form ── */}
      <div className="flex-1 bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100">
          <h2 className="text-sm font-semibold text-slate-800">Product Details</h2>
          <p className="text-xs text-slate-400 mt-0.5">Enter the product information to classify</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div className="space-y-1.5">
            <label htmlFor="title" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Product Title <span className="text-red-400">*</span>
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              disabled={isLoading}
              placeholder="e.g. Sony WH-1000XM5 Wireless Headphones"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-150 disabled:opacity-50"
            />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label htmlFor="description" className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Description <span className="text-slate-300 text-xs normal-case font-normal tracking-normal">(optional)</span>
            </label>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={handleChange}
              disabled={isLoading}
              rows={3}
              placeholder="Briefly describe the product — materials, features, use case…"
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all duration-150 resize-none disabled:opacity-50"
            />
          </div>

          {/* Image dropzone */}
          <ImageDropzone file={image} onFileChange={setImage} />

          {/* Error message */}
          {status === 'error' && errorMsg && (
            <div className="flex items-center gap-2.5 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
              <svg className="w-4 h-4 text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-600">{errorMsg}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2.5 bg-slate-900 hover:bg-slate-700 disabled:bg-slate-400 text-white text-sm font-semibold rounded-xl px-5 py-3 transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900"
          >
            {isLoading ? (
              <>
                <span className="spinner" />
                Classifying…
              </>
            ) : (
              <>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                Classify Product
              </>
            )}
          </button>
        </form>
      </div>

      {/* ── Right column: result / placeholder ── */}
      <div className="flex-1 flex flex-col">
        {status === 'success' && result ? (
          <ResultCard result={result} onReset={handleReset} />
        ) : (
          /* Placeholder card */
          <div className="flex-1 flex flex-col items-center justify-center bg-white border border-dashed border-slate-200 rounded-2xl p-10 text-center min-h-72">
            <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
              <svg className="w-7 h-7 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-400">Results will appear here</p>
            <p className="text-xs text-slate-300 mt-1.5 max-w-xs leading-relaxed">
              Fill in the product details on the left and click{' '}
              <span className="font-medium text-slate-400">"Classify Product"</span> to get the category prediction.
            </p>

            {/* Step hints */}
            <div className="mt-8 space-y-2.5 w-full max-w-xs text-left">
              {[
                ['1', 'Enter a product title'],
                ['2', 'Optionally add a description'],
                ['3', 'Upload a product image'],
                ['4', 'Submit and view results'],
              ].map(([num, label]) => (
                <div key={num} className="flex items-center gap-3">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 text-xs font-semibold flex items-center justify-center flex-shrink-0">
                    {num}
                  </span>
                  <span className="text-xs text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Loading overlay card */}
        {isLoading && (
          <div className="result-appear flex-1 flex flex-col items-center justify-center bg-white border border-slate-200 rounded-2xl p-10 text-center min-h-72 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-slate-400 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
            <p className="text-sm font-medium text-slate-600">Classifying product…</p>
            <p className="text-xs text-slate-400 mt-1">Processing image and text features</p>
          </div>
        )}
      </div>
    </div>
  )
}
