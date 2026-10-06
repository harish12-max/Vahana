import { useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Register() {
  const navigate = useNavigate()
  const [formValues, setFormValues] = useState({
    role: 'AUTO_OWNER',
    name: '',
    email: '',
    mobileNumber: '',
    password: '',
    confirmPassword: '',
  })
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const updateFormValue = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isLoading) {
      return
    }

    const { name, email, mobileNumber, password, confirmPassword, role } = formValues

    if (!name.trim() || !email.trim() || !mobileNumber.trim() || !password || !confirmPassword) {
      setError('Please complete all required fields.')
      setSuccess('')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      setSuccess('')
      return
    }

    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await axios.post('http://localhost:5000/api/v1/auth/register', {
        name: name.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        password,
        role,
      })

      if (response.data?.success) {
        setSuccess('Account created successfully. Redirecting you to login...')
        window.setTimeout(() => navigate('/login'), 1200)
      } else {
        setError('We could not create your account. Please try again.')
      }
    } catch (requestError) {
      if (requestError.response?.status === 409) {
        setError('An account already exists with that email address or mobile number.')
      } else if (requestError.response?.data?.error?.message) {
        setError(requestError.response.data.error.message)
      } else if (!requestError.response) {
        setError('Unable to connect to Vahana. Please check your connection and try again.')
      } else {
        setError('We could not create your account right now. Please try again.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-10 text-slate-900 sm:px-8 sm:py-14">
      <div className="mx-auto w-full max-w-2xl">

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

        {/* Registration Card */}
        <section
          className="mt-10 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:mt-12 sm:p-8 lg:p-10"
          aria-labelledby="register-heading"
        >
          {/* Heading */}
          <p className="text-sm font-bold tracking-[0.14em] text-amber-600">
            JOIN VAHANA
          </p>

          <h1
            id="register-heading"
            className="mt-3 text-3xl font-black tracking-tight text-[#102a43] sm:text-4xl"
          >
            Create your account
          </h1>

          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-600">
            Choose how you want to use Vahana and get started with Bengaluru's
            local advertising network.
          </p>

          {/* Form */}
          <form
            className="mt-8 space-y-6"
            noValidate
            onSubmit={handleSubmit}
          >

            {error && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
                {success}
              </p>
            )}

            {/* User Information */}
            <div className="grid gap-5 sm:grid-cols-2">

              {/* Account Type */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="account-type"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Account type
                </label>

                <select
                  id="account-type"
                  name="role"
                  value={formValues.role}
                  onChange={updateFormValue}
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm text-slate-900 outline-none transition focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
                >
                  <option value="AUTO_OWNER">Auto Driver</option>
                  <option value="ADVERTISER">Advertiser</option>
                </select>
              </div>

              {/* Full Name */}
              <div className="sm:col-span-2">
                <label
                  htmlFor="full-name"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Full name
                </label>

                <input
                  id="full-name"
                  name="name"
                  type="text"
                  value={formValues.name}
                  onChange={updateFormValue}
                  autoComplete="name"
                  required
                  placeholder="Your full name"
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
                />
              </div>

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
                  value={formValues.email}
                  onChange={updateFormValue}
                  autoComplete="email"
                  required
                  placeholder="you@example.com"
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
                />
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="mobile-number"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Mobile number
                </label>

                <input
                  id="mobile-number"
                  name="mobileNumber"
                  type="tel"
                  value={formValues.mobileNumber}
                  onChange={updateFormValue}
                  autoComplete="tel"
                  inputMode="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
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
                    value={formValues.password}
                    onChange={updateFormValue}
                    autoComplete="new-password"
                    required
                    placeholder="Create a password"
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirm-password"
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  Confirm password
                </label>

                <div className="relative">
                  <input
                    id="confirm-password"
                    name="confirmPassword"
                    type={isConfirmPasswordVisible ? 'text' : 'password'}
                    value={formValues.confirmPassword}
                    onChange={updateFormValue}
                    autoComplete="new-password"
                    required
                    placeholder="Confirm your password"
                    className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 pr-12 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
                  />

                  <button
                    type="button"
                    aria-label={isConfirmPasswordVisible ? 'Hide confirm password' : 'Show confirm password'}
                    aria-pressed={isConfirmPasswordVisible}
                    onClick={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-slate-500 transition hover:text-[#102a43] focus:outline-none focus:ring-2 focus:ring-[#102a43]/20"
                  >
                    {isConfirmPasswordVisible ? (
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
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || Boolean(success)}
              className="flex min-h-12 w-full items-center justify-center rounded-lg bg-[#102a43] px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b] focus:outline-none focus:ring-4 focus:ring-[#102a43]/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="mt-6 text-center text-sm text-slate-600">
            Already have an account?{' '}
            <Link
              to="/login"
              className="font-bold text-[#102a43] underline decoration-amber-400 decoration-2 underline-offset-4 transition hover:text-amber-700"
            >
              Log in
            </Link>
          </p>
        </section>

        {/* Back to Home */}
        <Link
          to="/"
          className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#102a43]"
        >
          <span aria-hidden="true">&larr;</span>
          Back to home
        </Link>
      </div>
    </main>
  )
}

export default Register
