import Header from './components/Header'
import ClassifierForm from './components/ClassifierForm'

export default function App() {
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col">
      <Header />

      <main className="flex-1 px-4 sm:px-6 py-8">
        <div className="max-w-6xl mx-auto mb-7">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest">
            Classification Engine
          </p>
          <h2 className="text-2xl font-semibold text-slate-900 mt-1 tracking-tight">
            Classify a Product
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Provide a title, optional description, and an image — the model will predict the category.
          </p>
        </div>

        <ClassifierForm />
      </main>

      <footer className="py-4 border-t border-slate-100 text-center">
        <p className="text-xs text-slate-300">
          Product Catalog Utility · Multi-modal ML Classification
        </p>
      </footer>
    </div>
  )
}
