import { useState } from 'react'
import { Link } from 'react-router-dom'

function Login() {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-2">
      {/* Login Section */}
      <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md">

          {/* Logo */}
          <Link
            to="/"
            className="inline-flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-[#102a43]"
          >
            <span
              className="grid h-10 w-10 place-items-center rounded-xl bg-[#102a43] text-lg font-black text-[#fbbf24]"
              aria-hidden="true"
            >
              V
            </span>

            VAHANA
          </Link>

          {/* Login Card */}
          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">

            {/* Heading */}
            <p className="text-sm font-bold tracking-[0.14em] text-amber-600">
              WELCOME TO VAHANA
            </p>

            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#102a43] sm:text-4xl">
              Welcome back
            </h1>

            <p className="mt-3 text-sm leading-6 text-slate-600">
              Sign in to manage your Vahana account and keep your journey
              moving.
            </p>

            {/* Login Form */}
            <form
              className="mt-8 space-y-5"
              onSubmit={(event) => event.preventDefault()}
            >

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Password
                </label>

                <div className="relative">
                  <input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    placeholder="Enter your password"
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
                  />

                  <button
                    type="button"
                    aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
                    aria-pressed={isPasswordVisible}
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 transition hover:text-[#102a43] focus:outline-none focus:ring-2 focus:ring-[#102a43]/20"
                  >
                    {isPasswordVisible ? (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="m3 3 18 18" strokeLinecap="round" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" strokeLinecap="round" />
                        <path d="M9.9 4.2A10.7 10.7 0 0 1 12 4c5.5 0 9.3 5.1 9.3 8s-2 4.9-4.7 6.3M6.1 6.1C3.5 7.7 2.7 10 2.7 12c0 2.9 3.8 8 9.3 8 1.3 0 2.5-.3 3.6-.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    ) : (
                      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <path d="M2.7 12S6.5 4 12 4s9.3 5.1 9.3 8-3.8 8-9.3 8-9.3-5.1-9.3-8Z" strokeLinecap="round" strokeLinejoin="round" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="flex min-h-12 w-full items-center justify-center rounded-lg bg-[#102a43] px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b] focus:outline-none focus:ring-4 focus:ring-[#102a43]/20"
              >
                Login
              </button>
            </form>

            {/* Register Link */}
            <p className="mt-6 text-center text-sm text-slate-600">
              New to Vahana?{' '}
              <Link
                to="/register"
                className="font-bold text-[#102a43] underline decoration-amber-400 decoration-2 underline-offset-4 transition hover:text-amber-700"
              >
                Create an account
              </Link>
            </p>
          </div>

          {/* Back to Home */}
          <Link
            to="/"
            className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#102a43]"
          >
            <span aria-hidden="true">←</span>
            Back to home
          </Link>
        </div>
      </section>

      {/* Brand Section */}
      <aside
        className="relative hidden overflow-hidden bg-[#102a43] p-12 lg:flex lg:flex-col lg:justify-between"
        aria-label="Vahana brand message"
      >
        {/* Background Decoration */}
        <div
          className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl"
          aria-hidden="true"
        />

        {/* Brand Message */}
        <div className="relative">
          <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold tracking-[0.14em] text-amber-300">
            BENGALURU ON THE MOVE
          </span>

          <h2 className="mt-8 max-w-md text-5xl font-black leading-tight tracking-tight text-white">
            Local advertising, built for the road.
          </h2>

          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">
            Vahana connects brands, verified auto owners, and communities
            through campaigns that move with the city.
          </p>
        </div>

        {/* Verification Card */}
        <div className="relative rounded-2xl border border-white/15 bg-white/8 p-6">
          <div className="flex items-center gap-4">
            <span
              className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400 text-xl font-black text-[#102a43]"
              aria-hidden="true"
            >
              ✓
            </span>

            <div>
              <p className="font-bold text-white">
                Verified local network
              </p>

              <p className="mt-1 text-sm text-slate-300">
                Managed, transparent, and ready to move.
              </p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  )
}

export default Login
