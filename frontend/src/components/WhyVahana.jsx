const reasons = [
  [
    '✓',
    'Verified Vehicles',
    'Partners and vehicles are reviewed before campaigns go live.',
  ],
  [
    '⌁',
    'Local Reach',
    'Connect with people in the Bengaluru neighbourhoods that matter.',
  ],
  [
    '↗',
    'Transparent Operations',
    'A clear, managed process from campaign setup to activation.',
  ],
]

function WhyVahana() {
  return (
    <section className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="text-center">
          <p className="text-sm font-bold tracking-[0.16em] text-amber-600">
            BUILT FOR THE REAL WORLD
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#102a43] sm:text-4xl">
            WHY VAHANA?
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {reasons.map(([icon, title, copy]) => (
            <article
              key={title}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-7"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-amber-100 text-2xl font-black text-amber-700">
                {icon}
              </span>

              <h3 className="mt-6 text-xl font-bold text-[#102a43]">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-slate-600">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WhyVahana