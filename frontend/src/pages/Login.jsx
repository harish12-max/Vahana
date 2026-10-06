import { useState } from 'react'
import axiosInstance from '../api/axiosInstance'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  const navigate = useNavigate()
  const { setUser } = useAuth()
  const [formValues, setFormValues] = useState({ email: '', password: '' })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isLoading) return

    const email = formValues.email.trim()
    const { password } = formValues

    if (!email || !password) {
      setError('Please enter your email and password.')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await axiosInstance.post('/auth/login', { email, password })
      const user = response.data?.data?.user

      if (!response.data?.success || !user) {
        setError('We could not sign you in. Please try again.')
        return
      }

      setUser(user)

      if (user.role === 'ADMIN') {
        navigate('/dashboard')
      } else if (user.role === 'ADVERTISER') {
        navigate('/dashboard')
      } else if (user.role === 'AUTO_OWNER') {
        navigate('/dashboard')
      } else {
        setError('Your account role is not supported.')
      }
    } catch (requestError) {
      if (requestError.response?.status === 401) {
        setError('Invalid email or password.')
      } else if (requestError.response?.data?.error?.message) {
        setError(requestError.response.data.error.message)
      } else if (!requestError.response) {
        setError('Unable to connect to Vahana. Please check your connection and try again.')
      } else {
        setError('We could not sign you in right now. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 lg:grid lg:grid-cols-2">
      <section className="flex items-center justify-center px-5 py-10 sm:px-8 lg:px-16 xl:px-24">
        <div className="w-full max-w-md">
          <Link to="/" className="inline-flex items-center gap-2.5 text-xl font-extrabold tracking-tight text-[#102a43]">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#102a43] text-lg font-black text-[#fbbf24]" aria-hidden="true">V</span>
            VAHANA
          </Link>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
            <p className="text-sm font-bold tracking-[0.14em] text-amber-600">WELCOME TO VAHANA</p>
            <h1 className="mt-3 text-3xl font-black tracking-tight text-[#102a43] sm:text-4xl">Welcome back</h1>
            <p className="mt-3 text-sm leading-6 text-slate-600">Sign in to manage your Vahana account and keep your journey moving.</p>

            <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
              {error && (
                <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  {error}
                </p>
              )}

              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-bold text-slate-700">Email address</label>
                <input id="email" name="email" type="email" value={formValues.email} onChange={handleChange} autoComplete="email" required placeholder="you@example.com" className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10" />
              </div>

              <div>
                <label htmlFor="password" className="mb-2 block text-sm font-bold text-slate-700">Password</label>
                <div className="relative">
                  <input id="password" name="password" type={isPasswordVisible ? 'text' : 'password'} value={formValues.password} onChange={handleChange} autoComplete="current-password" required placeholder="Enter your password" className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10" />
                  <button type="button" aria-label={isPasswordVisible ? 'Hide password' : 'Show password'} aria-pressed={isPasswordVisible} onClick={() => setIsPasswordVisible(!isPasswordVisible)} className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 transition hover:text-[#102a43] focus:outline-none focus:ring-2 focus:ring-[#102a43]/20">
                    {isPasswordVisible ? '◉' : '◌'}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={isLoading} className="flex min-h-12 w-full items-center justify-center rounded-lg bg-[#102a43] px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b] focus:outline-none focus:ring-4 focus:ring-[#102a43]/20 disabled:cursor-not-allowed disabled:opacity-70">
                {isLoading ? 'Signing in...' : 'Login'}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-600">
              New to Vahana?{' '}
              <Link to="/register" className="font-bold text-[#102a43] underline decoration-amber-400 decoration-2 underline-offset-4 transition hover:text-amber-700">
                Create an account
              </Link>
            </p>
          </div>

          <Link to="/" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#102a43]">
            <span aria-hidden="true">←</span>
            Back to home
          </Link>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-[#102a43] p-12 lg:flex lg:flex-col lg:justify-between" aria-label="Vahana brand message">
        <div className="absolute -right-20 -top-16 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl" aria-hidden="true" />
        <div className="relative">
          <span className="inline-flex rounded-full border border-amber-400/30 bg-amber-400/10 px-4 py-2 text-xs font-bold tracking-[0.14em] text-amber-300">BENGALURU ON THE MOVE</span>
          <h2 className="mt-8 max-w-md text-5xl font-black leading-tight tracking-tight text-white">Local advertising, built for the road.</h2>
          <p className="mt-6 max-w-md text-lg leading-8 text-slate-300">Vahana connects brands, verified auto owners, and communities through campaigns that move with the city.</p>
        </div>
        <div className="relative rounded-2xl border border-white/15 bg-white/8 p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-amber-400 text-xl font-black text-[#102a43]" aria-hidden="true">✓</span>
            <div>
              <p className="font-bold text-white">Verified local network</p>
              <p className="mt-1 text-sm text-slate-300">Managed, transparent, and ready to move.</p>
            </div>
          </div>
        </div>
      </aside>
    </main>
  )
}

export default Login
