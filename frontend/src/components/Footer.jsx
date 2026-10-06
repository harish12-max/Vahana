import { Link } from 'react-router-dom'

function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-5 py-10 sm:flex-row sm:items-end lg:px-8">
        <div>
          <a
            href="#top"
            className="flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-white"
          >
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-[#fbbf24] text-lg font-black text-[#102a43]">
              V
            </span>

            VAHANA
          </a>

          <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">
            Local advertising that moves with Bengaluru.
          </p>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
          <a href="#advertisers" className="hover:text-amber-400">
            Advertisers
          </a>

          <a href="#auto-owners" className="hover:text-amber-400">
            Auto Owners
          </a>

          <Link to="/login" className="hover:text-amber-400">
            Login
          </Link>

          <Link to="/register" className="hover:text-amber-400">
            Register
          </Link>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto max-w-7xl px-5 py-5 text-xs text-slate-500 lg:px-8">
          © {new Date().getFullYear()} Vahana. All rights reserved.
        </div>
      </div>
    </footer>
  )
}

export default Footer