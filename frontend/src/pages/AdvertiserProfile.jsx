import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'

const emptyProfile = {
  businessName: '',
  businessType: '',
  businessAddress: '',
  city: '',
  locality: '',
  pincode: '',
}

const profileFields = [
  { name: 'businessName', label: 'Business name', autoComplete: 'organization' },
  { name: 'businessType', label: 'Business type', autoComplete: 'organization-title' },
  { name: 'businessAddress', label: 'Business address', type: 'textarea', autoComplete: 'street-address' },
  { name: 'city', label: 'City', autoComplete: 'address-level2' },
  { name: 'locality', label: 'Locality / area', autoComplete: 'address-level3' },
  { name: 'pincode', label: 'PIN code', inputMode: 'numeric', autoComplete: 'postal-code', maxLength: 6 },
]

const toFormValues = (profile) =>
  profileFields.reduce((values, { name }) => ({ ...values, [name]: profile?.[name] ?? '' }), {})

const getErrorMessage = (error, fallback) =>
  error.response?.data?.error?.message || fallback

function AdvertiserProfile() {
  const [profile, setProfile] = useState(null)
  const [formValues, setFormValues] = useState(emptyProfile)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [editing, setEditing] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await axiosInstance.get('/profiles/advertiser')
        const savedProfile = response.data?.data?.profile

        if (!savedProfile) {
          throw new Error('Profile data was unavailable.')
        }

        setProfile(savedProfile)
        setFormValues(toFormValues(savedProfile))
      } catch (error) {
        if (error.response?.status === 404) {
          setProfile(null)
          setFormValues(emptyProfile)
          setEditing(true)
        } else {
          setLoadError(getErrorMessage(error, 'We could not load your business profile. Please try again.'))
        }
      } finally {
        setLoading(false)
      }
    }

    loadProfile()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormValues((currentValues) => ({ ...currentValues, [name]: value }))
    setFormError('')
    setSuccess('')
  }

  const validate = () => {
    const missingField = profileFields.find(({ name }) => !formValues[name].trim())

    if (missingField) {
      return `Please enter your ${missingField.label.toLowerCase()}.`
    }

    if (!/^\d{6}$/.test(formValues.pincode.trim())) {
      return 'Please enter a valid six-digit Indian PIN code.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    const validationError = validate()
    if (validationError) {
      setFormError(validationError)
      return
    }

    const payload = Object.fromEntries(
      Object.entries(formValues).map(([key, value]) => [key, value.trim()]),
    )

    setSubmitting(true)
    setFormError('')
    setSuccess('')

    try {
      const response = profile
        ? await axiosInstance.patch('/profiles/advertiser', payload)
        : await axiosInstance.post('/profiles/advertiser', payload)
      const savedProfile = response.data?.data?.profile

      if (!savedProfile) {
        throw new Error('The profile was saved but no profile data was returned.')
      }

      setProfile(savedProfile)
      setFormValues(toFormValues(savedProfile))
      setEditing(false)
      setSuccess(profile ? 'Business profile updated successfully.' : 'Business profile created successfully.')
    } catch (error) {
      setFormError(getErrorMessage(error, 'We could not save your business profile. Please try again.'))
    } finally {
      setSubmitting(false)
    }
  }

  const handleCancel = () => {
    setFormValues(profile ? toFormValues(profile) : emptyProfile)
    setFormError('')
    setSuccess('')
    setEditing(false)
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-[#102a43]">
        <p className="text-sm font-semibold">Loading your business profile...</p>
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-slate-900">
        <section className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-7 shadow-xl shadow-slate-900/5">
          <p className="text-sm font-bold tracking-[0.14em] text-amber-600">VAHANA</p>
          <h1 className="mt-3 text-2xl font-black text-[#102a43]">Profile unavailable</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-slate-600">{loadError}</p>
          <Link to="/dashboard" className="mt-6 inline-flex rounded-lg bg-[#102a43] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#183b5b]">Return to dashboard</Link>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#102a43]">
          <span aria-hidden="true">&larr;</span>
          Back to dashboard
        </Link>

        <header className="mt-8 rounded-2xl bg-[#102a43] p-6 text-white shadow-xl shadow-slate-900/15 sm:p-8">
          <p className="text-sm font-bold tracking-[0.14em] text-amber-300">ADVERTISER PROFILE</p>
          <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Your business details</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Keep your business information current so Vahana can support your local advertising journey.</p>
        </header>

        {success && <p role="status" className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</p>}

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" aria-labelledby="business-profile-heading">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 id="business-profile-heading" className="text-xl font-black text-[#102a43]">Business information</h2>
              <p className="mt-1 text-sm text-slate-600">All fields are required.</p>
            </div>
            {profile && !editing && (
              <button type="button" onClick={() => { setEditing(true); setSuccess('') }} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#102a43] px-4 text-sm font-bold text-[#102a43] transition hover:bg-slate-50">
                Edit profile
              </button>
            )}
          </div>

          {editing ? (
            <form className="mt-7" noValidate onSubmit={handleSubmit}>
              {formError && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{formError}</p>}
              <div className="grid gap-5 sm:grid-cols-2">
                {profileFields.map(({ name, label, type, ...inputProps }) => (
                  <div key={name} className={name === 'businessAddress' ? 'sm:col-span-2' : ''}>
                    <label htmlFor={name} className="mb-2 block text-sm font-bold text-slate-700">{label}</label>
                    {type === 'textarea' ? (
                      <textarea id={name} name={name} value={formValues[name]} onChange={handleChange} required rows="4" {...inputProps} className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10" />
                    ) : (
                      <input id={name} name={name} type="text" value={formValues[name]} onChange={handleChange} required {...inputProps} className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10" />
                    )}
                  </div>
                ))}
              </div>
              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                {profile && <button type="button" disabled={submitting} onClick={handleCancel} className="min-h-12 rounded-lg px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed">Cancel</button>}
                <button type="submit" disabled={submitting} className="min-h-12 rounded-lg bg-[#102a43] px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b] disabled:cursor-not-allowed disabled:opacity-70">
                  {submitting ? 'Saving...' : profile ? 'Save changes' : 'Save business profile'}
                </button>
              </div>
            </form>
          ) : (
            <dl className="mt-7 grid gap-5 sm:grid-cols-2">
              {profileFields.map(({ name, label }) => (
                <div key={name} className={name === 'businessAddress' ? 'sm:col-span-2' : ''}>
                  <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">{label}</dt>
                  <dd className="mt-1 whitespace-pre-line text-sm font-medium leading-6 text-slate-800">{profile?.[name]}</dd>
                </div>
              ))}
            </dl>
          )}
        </section>
      </div>
    </main>
  )
}

export default AdvertiserProfile
