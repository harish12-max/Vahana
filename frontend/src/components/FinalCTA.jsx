import { Link } from 'react-router-dom'

function FinalCTA() {
  return (
    <section className="bg-[#102a43] px-5 py-20 sm:py-24 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-3xl border border-white/15 bg-[#183b5b] px-6 py-14 text-center shadow-2xl shadow-slate-950/20 sm:px-12">
        <p className="text-sm font-bold tracking-[0.16em] text-amber-400">
          BENGALURU, LET&apos;S GO
        </p>

        <h2 className="mt-4 text-4xl font-black tracking-tight text-white sm:text-5xl">
          READY TO MOVE?
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-lg leading-8 text-slate-300">
          Whether you are growing a brand or putting your auto to work, Vahana
          is ready to help you move forward.
        </p>

        <Link
          to="/register"
          className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-[#fbbf24] px-6 text-sm font-bold text-[#102a43] transition hover:bg-amber-400"
        >
          Get Started with Vahana
          <span className="ml-2" aria-hidden="true">
            →
          </span>
        </Link>
      </div>
    </section>
  )
}

export default FinalCTA