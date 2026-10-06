import { Link } from 'react-router-dom'

const benefits = [
  'Local reach',
  'Verified vehicles',
  'Campaign tracking',
  'Transparent process',
]

function AdvertiserSection() {
  return (
    <section id="advertisers" className="bg-[#102a43] py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:px-8">
        <div>
          <p className="text-sm font-bold tracking-[0.16em] text-amber-400">
            FOR ADVERTISERS
          </p>

          <h2 className="mt-4 max-w-lg text-4xl font-black tracking-tight text-white sm:text-5xl">
            Put your brand where Bengaluru moves.
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
            Make your campaign part of the everyday city commute. Vahana
            brings local visibility together with a more accountable, managed
            process.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-[#fbbf24] px-6 text-sm font-bold text-[#102a43] transition hover:bg-amber-400"
          >
            Start Advertising
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
        </div>

        <ul className="grid gap-3 sm:grid-cols-2">
          {benefits.map((benefit) => (
            <li
              key={benefit}
              className="flex min-h-28 flex-col justify-between rounded-2xl border border-white/15 bg-white/8 p-5 text-white"
            >
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-amber-400 text-lg font-black text-[#102a43]">
                ✓
              </span>

              <span className="font-bold">{benefit}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default AdvertiserSection