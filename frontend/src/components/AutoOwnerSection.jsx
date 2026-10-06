import { Link } from 'react-router-dom'

const benefits = [
  'Get verified',
  'Accept campaigns',
  'Display approved ads',
  'Track your earnings',
]

function AutoOwnerSection() {
  return (
    <section id="auto-owners" className="bg-amber-50 py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8">
        <div className="order-2 rounded-3xl bg-[#102a43] p-7 shadow-xl shadow-slate-900/10 sm:p-10 lg:order-1">
          <div className="grid grid-cols-2 gap-4">
            {benefits.map((benefit, index) => (
              <div
                key={benefit}
                className="rounded-2xl border border-white/10 bg-white/8 p-5 text-white"
              >
                <span className="text-2xl font-black text-amber-400">
                  0{index + 1}
                </span>

                <p className="mt-7 font-bold">{benefit}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <p className="text-sm font-bold tracking-[0.16em] text-amber-700">
            FOR AUTO OWNERS
          </p>

          <h2 className="mt-4 max-w-lg text-4xl font-black tracking-tight text-[#102a43] sm:text-5xl">
            Your auto can do more for you.
          </h2>

          <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
            Turn your auto into an additional income opportunity. Join a
            verified network and display campaigns that are approved and
            managed by Vahana.
          </p>

          <Link
            to="/register"
            className="mt-8 inline-flex min-h-12 items-center rounded-lg bg-[#102a43] px-6 text-sm font-bold text-white transition hover:bg-[#183b5b]"
          >
            Become an Auto Partner
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export default AutoOwnerSection