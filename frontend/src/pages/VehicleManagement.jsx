
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import LogoutButton from '../components/LogoutButton.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

const emptyVehicle = {
  registrationNumber: '',
  vehicleType: '',
  ownershipInformation: ''
}

const vehicleFields = [
  {
    name: 'registrationNumber',
    label: 'Registration number',
    autoComplete: 'off',
    maxLength: 15
  },
  {
    name: 'vehicleType',
    label: 'Vehicle type',
    autoComplete: 'off',
    maxLength: 100
  },
  {
    name: 'ownershipInformation',
    label: 'Ownership information',
    type: 'textarea',
    maxLength: 200
  }
]

const toFormValues = (vehicle) =>
  vehicleFields.reduce(
    (values, { name }) => ({
      ...values,
      [name]: vehicle?.[name] ?? ''
    }),
    {}
  )

const getErrorMessage = (error, fallback) =>
  error.response?.data?.error?.message || fallback

function VehicleManagement() {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicle, setSelectedVehicle] = useState(null)
  const [formValues, setFormValues] = useState(emptyVehicle)
  const [loading, setLoading] = useState(true)
  const [detailLoading, setDetailLoading] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [detailError, setDetailError] = useState('')
  const [formMode, setFormMode] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState('')
  const [success, setSuccess] = useState('')

  const loadVehicles = async () => {
    const response = await axiosInstance.get('/vehicles')
    const savedVehicles = response.data?.data?.vehicles

    if (!Array.isArray(savedVehicles)) {
      throw new Error('Vehicle data was unavailable.')
    }

    setVehicles(savedVehicles)
  }

  useEffect(() => {
    const load = async () => {
      try {
        await loadVehicles()
      } catch (error) {
        setLoadError(
          getErrorMessage(
            error,
            'We could not load your vehicles. Please try again.'
          )
        )
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setFormValues((currentValues) => ({
      ...currentValues,
      [name]: value
    }))

    setFormError('')
    setSuccess('')
  }

  const validate = () => {
    const missingField = vehicleFields.find(
      ({ name }) => !formValues[name].trim()
    )

    if (missingField) {
      return `Please enter the ${missingField.label.toLowerCase()}.`
    }

    const registrationNumber = formValues.registrationNumber.replace(
      /[\s-]/g,
      ''
    )

    if (!/^[A-Za-z0-9]{6,15}$/.test(registrationNumber)) {
      return 'Please enter a valid registration number using 6 to 15 letters or numbers.'
    }

    if (formValues.vehicleType.trim().length < 2) {
      return 'Vehicle type must be at least 2 characters long.'
    }

    if (formValues.ownershipInformation.trim().length < 2) {
      return 'Ownership information must be at least 2 characters long.'
    }

    return ''
  }

  const openCreateForm = () => {
    setFormMode('create')
    setFormValues(emptyVehicle)
    setFormError('')
    setSuccess('')
  }

  const openEditForm = () => {
    if (!selectedVehicle) return

    setFormMode('edit')
    setFormValues(toFormValues(selectedVehicle))
    setFormError('')
    setSuccess('')
  }

  const viewVehicle = async (vehicleId) => {
    setDetailLoading(true)
    setDetailError('')
    setSuccess('')

    try {
      const response = await axiosInstance.get(
        `/vehicles/${vehicleId}`
      )
      const vehicle = response.data?.data?.vehicle

      if (!vehicle) {
        throw new Error('Vehicle data was unavailable.')
      }

      setSelectedVehicle(vehicle)
      setFormMode(null)
    } catch (error) {
      setDetailError(
        getErrorMessage(
          error,
          'We could not load this vehicle. Please try again.'
        )
      )
    } finally {
      setDetailLoading(false)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (submitting || !formMode) return

    const validationError = validate()

    if (validationError) {
      setFormError(validationError)
      return
    }

    const payload = {
      registrationNumber: formValues.registrationNumber
        .replace(/[\s-]/g, '')
        .toUpperCase(),
      vehicleType: formValues.vehicleType.trim(),
      ownershipInformation: formValues.ownershipInformation.trim()
    }

    setSubmitting(true)
    setFormError('')
    setSuccess('')

    try {
      const response =
        formMode === 'edit'
          ? await axiosInstance.patch(
              `/vehicles/${selectedVehicle._id}`,
              payload
            )
          : await axiosInstance.post('/vehicles', payload)

      const savedVehicle = response.data?.data?.vehicle

      if (!savedVehicle) {
        throw new Error(
          'The vehicle was saved but no vehicle data was returned.'
        )
      }

      setSelectedVehicle(savedVehicle)

      setVehicles((currentVehicles) => {
        const currentIndex = currentVehicles.findIndex(
          ({ _id }) => _id === savedVehicle._id
        )

        if (currentIndex === -1) {
          return [savedVehicle, ...currentVehicles]
        }

        return currentVehicles.map((vehicle) =>
          vehicle._id === savedVehicle._id
            ? savedVehicle
            : vehicle
        )
      })

      setFormValues(toFormValues(savedVehicle))
      setFormMode(null)

      setSuccess(
        formMode === 'edit'
          ? 'Vehicle updated successfully. Its verification status is pending.'
          : 'Vehicle registered successfully.'
      )
    } catch (error) {
      setFormError(
        getErrorMessage(
          error,
          'We could not save your vehicle. Please try again.'
        )
      )
    } finally {
      setSubmitting(false)
    }
  }

  const cancelForm = () => {
    setFormMode(null)
    setFormValues(
      selectedVehicle ? toFormValues(selectedVehicle) : emptyVehicle
    )
    setFormError('')
  }

  if (loading) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-[#102a43]">
        <p className="text-sm font-semibold">
          Loading your vehicles...
        </p>
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-slate-900">
        <section className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-7 shadow-xl shadow-slate-900/5">
          <p className="text-sm font-bold tracking-[0.14em] text-amber-600">
            VAHANA
          </p>

          <h1 className="mt-3 text-2xl font-black text-[#102a43]">
            Vehicles unavailable
          </h1>

          <p
            role="alert"
            className="mt-3 text-sm leading-6 text-slate-600"
          >
            {loadError}
          </p>

          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <Link
              to="/dashboard"
              className="inline-flex rounded-lg bg-[#102a43] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#183b5b]"
            >
              Return to dashboard
            </Link>

            <LogoutButton className="text-[#102a43]" />
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#102a43]"
        >
          <span aria-hidden="true">&larr;</span>
          Back to dashboard
        </Link>

        <header className="mt-8 rounded-2xl bg-[#102a43] p-6 text-white shadow-xl shadow-slate-900/15 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold tracking-[0.14em] text-amber-300">
                VEHICLE MANAGEMENT
              </p>

              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">
                Your vehicles
              </h1>
            </div>

            <LogoutButton />
          </div>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
            Register and keep your vehicle details up to date.
          </p>
        </header>

        {success && (
          <p
            role="status"
            className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700"
          >
            {success}
          </p>
        )}

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
          <section
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
            aria-labelledby="vehicle-list-heading"
          >
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2
                  id="vehicle-list-heading"
                  className="text-xl font-black text-[#102a43]"
                >
                  Registered vehicles
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  {vehicles.length === 1
                    ? '1 vehicle'
                    : `${vehicles.length} vehicles`}
                </p>
              </div>

              <button
                type="button"
                onClick={openCreateForm}
                className="inline-flex min-h-11 items-center justify-center rounded-lg bg-[#102a43] px-4 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b]"
              >
                Register vehicle
              </button>
            </div>

            {vehicles.length === 0 ? (
              <div className="mt-7 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-8 text-center">
                <p className="font-bold text-[#102a43]">
                  No vehicles registered yet
                </p>

                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Register your first vehicle to manage its information here.
                </p>
              </div>
            ) : (
              <ul className="mt-7 space-y-3">
                {vehicles.map((vehicle) => (
                  <li key={vehicle._id}>
                    <button
                      type="button"
                      onClick={() => viewVehicle(vehicle._id)}
                      disabled={detailLoading}
                      className="flex w-full items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-[#102a43] hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
                    >
                      <span>
                        <span className="block font-black text-[#102a43]">
                          {vehicle.registrationNumber}
                        </span>

                        <span className="mt-1 block text-sm text-slate-600">
                          {vehicle.vehicleType}
                        </span>
                      </span>

                      <span className="text-sm font-bold text-slate-500">
                        View
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8"
            aria-labelledby="vehicle-details-heading"
          >
            {formMode ? (
              <form noValidate onSubmit={handleSubmit}>
                <h2
                  id="vehicle-details-heading"
                  className="text-xl font-black text-[#102a43]"
                >
                  {formMode === 'edit'
                    ? 'Edit vehicle'
                    : 'Register a vehicle'}
                </h2>

                <p className="mt-1 text-sm text-slate-600">
                  All fields are required.
                </p>

                {formError && (
                  <p
                    role="alert"
                    className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                  >
                    {formError}
                  </p>
                )}

                <div className="mt-6 space-y-5">
                  {vehicleFields.map(
                    ({ name, label, type, ...inputProps }) => (
                      <div key={name}>
                        <label
                          htmlFor={name}
                          className="mb-2 block text-sm font-bold text-slate-700"
                        >
                          {label}
                        </label>

                        {type === 'textarea' ? (
                          <textarea
                            id={name}
                            name={name}
                            value={formValues[name]}
                            onChange={handleChange}
                            required
                            rows="4"
                            {...inputProps}
                            className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
                          />
                        ) : (
                          <input
                            id={name}
                            name={name}
                            type="text"
                            value={formValues[name]}
                            onChange={handleChange}
                            required
                            {...inputProps}
                            className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm uppercase outline-none transition focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10"
                          />
                        )}
                      </div>
                    )
                  )}
                </div>

                <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={cancelForm}
                    className="min-h-12 rounded-lg px-5 text-sm font-bold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="min-h-12 rounded-lg bg-[#102a43] px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b] disabled:cursor-not-allowed disabled:opacity-70"
                  >
                    {submitting
                      ? 'Saving...'
                      : formMode === 'edit'
                        ? 'Save changes'
                        : 'Register vehicle'}
                  </button>
                </div>
              </form>
            ) : detailLoading ? (
              <div className="grid min-h-56 place-items-center">
                <p className="text-sm font-semibold text-[#102a43]">
                  Loading vehicle details...
                </p>
              </div>
            ) : detailError ? (
              <div>
                <h2
                  id="vehicle-details-heading"
                  className="text-xl font-black text-[#102a43]"
                >
                  Vehicle details
                </h2>

                <p
                  role="alert"
                  className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
                >
                  {detailError}
                </p>
              </div>
            ) : selectedVehicle ? (
              <div>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2
                      id="vehicle-details-heading"
                      className="text-xl font-black text-[#102a43]"
                    >
                      Vehicle details
                    </h2>

                    <p className="mt-1 flex items-center gap-2 text-sm text-slate-600">
                      Verification status:{' '}
                      <StatusBadge
                        status={selectedVehicle.verificationStatus}
                      />
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={openEditForm}
                    className="inline-flex min-h-11 items-center justify-center rounded-lg border border-[#102a43] px-4 text-sm font-bold text-[#102a43] transition hover:bg-slate-50"
                  >
                    Edit vehicle
                  </button>
                </div>

                <dl className="mt-7 space-y-5">
                  {vehicleFields.map(({ name, label }) => (
                    <div key={name}>
                      <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                        {label}
                      </dt>

                      <dd className="mt-1 whitespace-pre-line text-sm font-medium leading-6 text-slate-800">
                        {selectedVehicle[name]}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            ) : (
              <div className="grid min-h-56 place-items-center text-center">
                <div>
                  <h2
                    id="vehicle-details-heading"
                    className="text-xl font-black text-[#102a43]"
                  >
                    Vehicle details
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Select a vehicle to view its details, or register a new one.
                  </p>
                </div>
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  )
}

export default VehicleManagement
