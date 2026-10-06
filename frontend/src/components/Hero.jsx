import { Link } from 'react-router-dom'

function Hero() {
  return (
    <section id="top" className="overflow-hidden bg-[#f8fafc]">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
        <div className="max-w-2xl">
          <p className="mb-5 inline-flex rounded-full bg-amber-100 px-4 py-2 text-xs font-bold tracking-[0.14em] text-amber-800">
            BENGALURU'S LOCAL ADVERTISING NETWORK
          </p>

          <h1 className="text-5xl font-black leading-[0.98] tracking-tight text-[#102a43] sm:text-6xl lg:text-7xl">
            PUT YOUR BRAND{' '}
            <span className="text-amber-500">ON THE MOVE</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-600">
            Reach Bengaluru where it moves—with memorable advertising on
            verified local autos, managed end to end by Vahana.
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-lg bg-[#102a43] px-6 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b]"
            >
              Advertise with Vahana
              <span className="ml-2" aria-hidden="true">
                →
              </span>
            </Link>

            <Link
              to="/register"
              className="inline-flex min-h-12 items-center justify-center rounded-lg border border-slate-300 bg-white px-6 text-sm font-bold text-[#102a43] transition hover:border-[#102a43] hover:bg-slate-50"
            >
              Earn with Your Auto
            </Link>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-7 gap-y-3 text-sm font-medium text-slate-600">
            <span className="flex items-center gap-2">
              <span className="text-emerald-600">●</span>
              Verified vehicles
            </span>

            <span className="flex items-center gap-2">
              <span className="text-emerald-600">●</span>
              Managed campaigns
            </span>
          </div>
        </div>

        <div
          className="relative mx-auto w-full max-w-xl lg:max-w-none"
          aria-label="Illustration of a branded Bengaluru auto rickshaw"
        >
          <div
            className="absolute -right-10 top-8 h-52 w-52 rounded-full bg-amber-200/70 blur-3xl"
            aria-hidden="true"
          />

          <div className="relative rounded-[2rem] border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/10 sm:p-8">
            <div className="mb-5 flex items-center justify-between text-xs font-bold tracking-wider text-slate-500">
              <span>MADE TO MOVE</span>
              <span>ಬೆಂಗಳೂರು</span>
            </div>

            {/* SVG illustration */}

            <div className="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-emerald-100 font-bold text-emerald-700">
                ✓
              </span>

              <span>
                <strong className="block text-[#102a43]">
                  Verified and campaign-ready
                </strong>
                Vahana partners move with Bengaluru.
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero