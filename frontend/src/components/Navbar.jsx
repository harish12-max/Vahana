import { useState } from 'react'
import { Link } from 'react-router-dom'

const navigation = [
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'For Advertisers', href: '#advertisers' },
  { label: 'For Auto Owners', href: '#auto-owners' },
]

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const closeMenu = () => {
    setIsOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/95 backdrop-blur">
      <nav
        className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8"
        aria-label="Main navigation"
      >
        <a
          href="#top"
          onClick={closeMenu}
          className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-[#102a43]"
        >
          <span
            className="grid h-9 w-9 place-items-center rounded-xl bg-[#102a43] text-lg font-black text-[#fbbf24]"
            aria-hidden="true"
          >
            V
          </span>

          VAHANA
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-slate-600 transition hover:text-[#102a43]"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            to="/login"
            className="rounded-lg px-4 py-2 text-sm font-semibold text-[#102a43] transition hover:bg-slate-100"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="rounded-lg bg-[#fbbf24] px-4 py-2.5 text-sm font-bold text-[#102a43] shadow-sm transition hover:bg-amber-400"
          >
            Get Started
          </Link>
        </div>

        <button
          type="button"
          className="grid h-10 w-10 place-items-center rounded-lg text-[#102a43] transition hover:bg-slate-100 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="text-2xl leading-none" aria-hidden="true">
            {isOpen ? '×' : '☰'}
          </span>
        </button>
      </nav>

      {isOpen && (
        <div className="border-t border-slate-100 bg-white px-5 pb-5 md:hidden">
          <div className="flex flex-col gap-1 pt-3">
            {navigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="rounded-lg px-3 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                {item.label}
              </a>
            ))}

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-lg px-3 py-3 text-sm font-semibold text-[#102a43] hover:bg-slate-50"
            >
              Login
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="mt-1 rounded-lg bg-[#fbbf24] px-3 py-3 text-center text-sm font-bold text-[#102a43]"
            >
              Get Started
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}

export default Navbar