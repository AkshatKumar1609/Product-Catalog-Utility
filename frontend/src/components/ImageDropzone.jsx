import { useCallback, useRef, useState } from 'react'

export default function ImageDropzone({ file, onFileChange }) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef(null)

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setIsDragging(false)
      const dropped = e.dataTransfer.files[0]
      if (dropped && dropped.type.startsWith('image/')) {
        onFileChange(dropped)
      }
    },
    [onFileChange]
  )

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => setIsDragging(false)

  const handleInputChange = (e) => {
    const selected = e.target.files[0]
    if (selected) onFileChange(selected)
  }

  const previewUrl = file ? URL.createObjectURL(file) : null

  return (
    <div className="space-y-2">
      <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider">
        Product Image <span className="text-red-400">*</span>
      </label>

      {/* Drop zone / Preview */}
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={[
          'relative w-full rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200 overflow-hidden',
          isDragging
            ? 'border-slate-600 bg-slate-100 drag-active'
            : file
            ? 'border-slate-300 bg-slate-50'
            : 'border-slate-200 bg-slate-50 hover:border-slate-400 hover:bg-white',
        ].join(' ')}
        style={{ minHeight: '200px' }}
      >
        {previewUrl ? (
          /* Image preview */
          <div className="flex flex-col items-center justify-center p-3 gap-3">
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-52 object-contain rounded-lg"
            />
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
              <span className="truncate max-w-[180px]">{file.name}</span>
              <span className="text-slate-300">·</span>
              <span>{(file.size / 1024).toFixed(1)} KB</span>
            </div>
            <span className="text-xs text-slate-400 italic">Click to change image</span>
          </div>
        ) : (
          /* Placeholder */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 p-6">
            <div className={[
              'w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-200',
              isDragging ? 'bg-slate-200' : 'bg-slate-100',
            ].join(' ')}>
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-slate-600">
                {isDragging ? 'Drop image here' : 'Drag & drop an image'}
              </p>
              <p className="text-xs text-slate-400 mt-1">
                or <span className="text-slate-600 underline underline-offset-2">browse files</span>
              </p>
              <p className="text-xs text-slate-300 mt-2">PNG, JPG, WEBP supported</p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleInputChange}
      />
    </div>
  )
}
