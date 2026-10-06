const steps = [
  ['01', 'Create Campaign', 'Tell us who you want to reach and where.'],
  ['02', 'Get Approved', 'Our team reviews your campaign for the road.'],
  ['03', 'Get Matched', 'We match you with relevant verified autos.'],
  ['04', 'Go Live', 'Your brand starts moving through the city.'],
]

function HowItWorks() {
  return (
    <section id="how-it-works" className="bg-white py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="max-w-xl">
          <p className="text-sm font-bold tracking-[0.16em] text-amber-600">
            SIMPLE BY DESIGN
          </p>

          <h2 className="mt-3 text-3xl font-black tracking-tight text-[#102a43] sm:text-4xl">
            HOW VAHANA WORKS
          </h2>
        </div>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map(([number, title, copy]) => (
            <li
              key={number}
              className="rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-900/5"
            >
              <span className="text-4xl font-black text-amber-400">
                {number}
              </span>

              <h3 className="mt-8 text-lg font-bold text-[#102a43]">
                {title}
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                {copy}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}

export default HowItWorks