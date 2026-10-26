import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import LogoutButton from '../components/LogoutButton.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

const getErrorMessage = (error, fallback) =>
  error.response?.data?.error?.message || fallback

const formatDocumentType = (type) => ({
  REGISTRATION_CERTIFICATE: 'Registration Certificate',
  INSURANCE_CERTIFICATE: 'Insurance Certificate',
  VEHICLE_PERMIT: 'Vehicle Permit',
  DRIVING_LICENSE: 'Driving License',
}[type] || type)

const formatFileSize = (size) => {
  if (!Number.isFinite(size)) return 'Unknown size'
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

function ReviewActions({ item, kind, onReview, submitting }) {
  const isPending = item.verificationStatus === 'PENDING'

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {isPending ? (
        <>
          <button type="button" disabled={submitting} onClick={() => onReview(kind, item, 'APPROVED')} className="min-h-10 rounded-lg bg-emerald-600 px-3 text-sm font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-70">
            {submitting ? 'Saving...' : 'Approve'}
          </button>
          <button type="button" disabled={submitting} onClick={() => onReview(kind, item, 'REJECTED')} className="min-h-10 rounded-lg bg-red-600 px-3 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70">
            Reject
          </button>
        </>
      ) : (
        <span className="flex items-center gap-2 text-sm font-semibold text-slate-500"><StatusBadge status={item.verificationStatus} /> This item has already been reviewed.</span>
      )}
    </div>
  )
}

function AdminDashboard() {
  const [vehicles, setVehicles] = useState([])
  const [documents, setDocuments] = useState([])
  const [activeSection, setActiveSection] = useState('vehicles')
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState('')
  const [success, setSuccess] = useState('')
  const [actionError, setActionError] = useState('')
  const [reviewTarget, setReviewTarget] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [submittingId, setSubmittingId] = useState('')

  const loadData = async () => {
    const [vehicleResponse, documentResponse] = await Promise.all([
      axiosInstance.get('/admin/vehicles'),
      axiosInstance.get('/admin/documents'),
    ])
    const savedVehicles = vehicleResponse.data?.data?.vehicles
    const savedDocuments = documentResponse.data?.data?.documents

    if (!Array.isArray(savedVehicles) || !Array.isArray(savedDocuments)) {
      throw new Error('Admin review data was unavailable.')
    }

    setVehicles(savedVehicles)
    setDocuments(savedDocuments)
  }

  useEffect(() => {
    const load = async () => {
      try {
        await loadData()
      } catch (error) {
        setLoadError(getErrorMessage(error, 'We could not load the admin review queue. Please try again.'))
      } finally {
        setLoading(false)
      }
    }

    load()
  }, [])

  const ownerProfiles = useMemo(() => {
    const profiles = new Map()

    vehicles.forEach((vehicle) => {
      if (vehicle.owner?._id) profiles.set(vehicle.owner._id, vehicle.owner)
    })

    return [...profiles.values()]
  }, [vehicles])

  const pendingCount = vehicles.filter(({ verificationStatus }) => verificationStatus === 'PENDING').length
    + documents.filter(({ verificationStatus }) => verificationStatus === 'PENDING').length
    + ownerProfiles.filter(({ verificationStatus }) => verificationStatus === 'PENDING').length

  const beginReview = (kind, item, status) => {
    setActionError('')
    setSuccess('')
    if (kind === 'document' && status === 'REJECTED') {
      setReviewTarget({ kind, item, status })
      setRejectionReason('')
      return
    }

    submitReview({ kind, item, status })
  }

  const submitReview = async (target) => {
    const { kind, item, status } = target
    const itemId = item._id

    if (kind === 'document' && status === 'REJECTED' && !rejectionReason.trim()) {
      setActionError('Please provide a rejection reason for this document.')
      return
    }

    const endpoint = kind === 'vehicle'
      ? `/admin/vehicles/${itemId}/verification`
      : kind === 'profile'
        ? `/admin/auto-owners/${itemId}/verification`
        : `/admin/documents/${itemId}/verification`
    const payload = kind === 'document' && status === 'REJECTED'
      ? { verificationStatus: status, rejectionReason: rejectionReason.trim() }
      : { verificationStatus: status }

    setSubmittingId(`${kind}-${itemId}`)
    setActionError('')
    setSuccess('')

    try {
      const response = await axiosInstance.patch(endpoint, payload)
      const updated = kind === 'vehicle'
        ? response.data?.data?.vehicle
        : kind === 'profile'
          ? response.data?.data?.profile
          : response.data?.data?.document

      if (!updated) {
        throw new Error('The review was saved but no updated data was returned.')
      }

      if (kind === 'vehicle') {
        setVehicles((current) => current.map((vehicle) => (vehicle._id === updated._id ? { ...vehicle, ...updated } : vehicle)))
      } else if (kind === 'profile') {
        setVehicles((current) => current.map((vehicle) => (
          vehicle.owner?._id === updated._id ? { ...vehicle, owner: { ...vehicle.owner, ...updated } } : vehicle
        )))
      } else {
        setDocuments((current) => current.map((document) => (document._id === updated._id ? { ...document, ...updated } : document)))
      }

      setReviewTarget(null)
      setRejectionReason('')
      setSuccess(`${kind === 'profile' ? 'Auto-owner profile' : kind === 'vehicle' ? 'Vehicle' : 'Document'} ${status === 'APPROVED' ? 'approved' : 'rejected'} successfully.`)
    } catch (error) {
      setActionError(getErrorMessage(error, 'We could not save this review. Please try again.'))
    } finally {
      setSubmittingId('')
    }
  }

  if (loading) {
    return <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-[#102a43]"><p className="text-sm font-semibold">Loading admin review queue...</p></main>
  }

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-slate-900">
        <section className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-7 shadow-xl shadow-slate-900/5">
          <p className="text-sm font-bold tracking-[0.14em] text-amber-600">VAHANA</p>
          <h1 className="mt-3 text-2xl font-black text-[#102a43]">Admin data unavailable</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-slate-600">{loadError}</p>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4"><Link to="/dashboard" className="inline-flex rounded-lg bg-[#102a43] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#183b5b]">Return to dashboard</Link><LogoutButton className="text-[#102a43]" /></div>
        </section>
      </main>
    )
  }

  const sections = [
    { id: 'vehicles', label: 'Vehicles', count: vehicles.length },
    { id: 'profiles', label: 'Auto-owner profiles', count: ownerProfiles.length },
    { id: 'documents', label: 'Documents', count: documents.length },
  ]

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-6xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#102a43]"><span aria-hidden="true">&larr;</span>Back to dashboard</Link>
        <header className="mt-8 rounded-2xl bg-[#102a43] p-6 text-white shadow-xl shadow-slate-900/15 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="text-sm font-bold tracking-[0.14em] text-amber-300">ADMIN DASHBOARD</p><h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Verification review queue</h1></div><LogoutButton /></div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Review pending auto-owner profiles, vehicles, and vehicle documents.</p>
        </header>

        <section className="mt-6 grid gap-4 sm:grid-cols-3" aria-label="Review queue overview">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5"><p className="text-sm font-semibold text-slate-600">Vehicles</p><p className="mt-2 text-3xl font-black text-[#102a43]">{vehicles.length}</p></div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xl shadow-slate-900/5"><p className="text-sm font-semibold text-slate-600">Documents</p><p className="mt-2 text-3xl font-black text-[#102a43]">{documents.length}</p></div>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-xl shadow-amber-900/5"><p className="text-sm font-semibold text-amber-800">Pending reviews</p><p className="mt-2 text-3xl font-black text-amber-900">{pendingCount}</p></div>
        </section>

        {success && <p role="status" className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</p>}
        {actionError && <p role="alert" className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{actionError}</p>}

        <div className="mt-6 flex flex-wrap gap-2" aria-label="Admin review sections">
          {sections.map((section) => <button key={section.id} type="button" onClick={() => { setActiveSection(section.id); setActionError(''); setSuccess('') }} className={`min-h-11 rounded-lg px-4 text-sm font-bold transition ${activeSection === section.id ? 'bg-[#102a43] text-white' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}>{section.label} ({section.count})</button>)}
        </div>

        <section className="mt-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8">
          {activeSection === 'vehicles' && (
            <div><h2 className="text-xl font-black text-[#102a43]">Vehicle reviews</h2>{vehicles.length === 0 ? <p className="mt-4 text-sm text-slate-600">No vehicles are available for review.</p> : <div className="mt-6 grid gap-4 lg:grid-cols-2">{vehicles.map((vehicle) => <article key={vehicle._id} className="rounded-xl border border-slate-200 p-5"><div><StatusBadge status={vehicle.verificationStatus} /></div><h3 className="mt-2 text-lg font-black text-[#102a43]">{vehicle.registrationNumber}</h3><p className="mt-1 text-sm text-slate-600">{vehicle.vehicleType}</p><p className="mt-3 text-sm leading-6 text-slate-700">{vehicle.ownershipInformation}</p><ReviewActions item={vehicle} kind="vehicle" submitting={submittingId === `vehicle-${vehicle._id}`} onReview={beginReview} /></article>)}</div>}</div>
          )}
          {activeSection === 'profiles' && (
            <div><h2 className="text-xl font-black text-[#102a43]">Auto-owner profile reviews</h2><p className="mt-1 text-sm leading-6 text-slate-600">Only profiles linked to a listed vehicle are available because the current backend has no standalone profile listing endpoint.</p>{ownerProfiles.length === 0 ? <p className="mt-4 text-sm text-slate-600">No auto-owner profiles are available for review.</p> : <div className="mt-6 grid gap-4 lg:grid-cols-2">{ownerProfiles.map((profile) => <article key={profile._id} className="rounded-xl border border-slate-200 p-5"><div><StatusBadge status={profile.verificationStatus} /></div><h3 className="mt-2 text-lg font-black text-[#102a43]">{profile.locality}, {profile.city}</h3><p className="mt-3 whitespace-pre-line text-sm leading-6 text-slate-700">{profile.address}</p><p className="mt-1 text-sm text-slate-600">PIN {profile.pincode}</p><ReviewActions item={profile} kind="profile" submitting={submittingId === `profile-${profile._id}`} onReview={beginReview} /></article>)}</div>}</div>
          )}
          {activeSection === 'documents' && (
            <div><h2 className="text-xl font-black text-[#102a43]">Document reviews</h2>{documents.length === 0 ? <p className="mt-4 text-sm text-slate-600">No documents are available for review.</p> : <div className="mt-6 grid gap-4 lg:grid-cols-2">{documents.map((document) => <article key={document._id} className="rounded-xl border border-slate-200 p-5"><div><StatusBadge status={document.verificationStatus} /></div><h3 className="mt-2 text-lg font-black text-[#102a43]">{formatDocumentType(document.documentType)}</h3><p className="mt-1 break-all text-sm text-slate-600">{document.originalFilename} · {formatFileSize(document.fileSize)}</p><p className="mt-3 text-sm text-slate-700">Vehicle: {document.vehicle?.registrationNumber || 'Unavailable'}{document.vehicle?.vehicleType ? ` (${document.vehicle.vehicleType})` : ''}</p>{document.verificationStatus === 'REJECTED' && document.rejectionReason && <p className="mt-2 text-sm leading-6 text-red-700">Reason: {document.rejectionReason}</p>}<ReviewActions item={document} kind="document" submitting={submittingId === `document-${document._id}`} onReview={beginReview} /></article>)}</div>}</div>
          )}
        </section>

        {reviewTarget && (
          <div className="fixed inset-0 z-10 grid place-items-center bg-slate-900/50 p-5" role="dialog" aria-modal="true" aria-labelledby="rejection-heading">
            <form onSubmit={(event) => { event.preventDefault(); submitReview(reviewTarget) }} className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
              <h2 id="rejection-heading" className="text-xl font-black text-[#102a43]">Reject document</h2>
              <p className="mt-2 text-sm leading-6 text-slate-600">A rejection reason is required by the backend and will be visible to the owner.</p>
              <label htmlFor="rejectionReason" className="mb-2 mt-5 block text-sm font-bold text-slate-700">Rejection reason</label>
              <textarea id="rejectionReason" value={rejectionReason} onChange={(event) => { setRejectionReason(event.target.value); setActionError('') }} required rows="4" maxLength="500" className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10" />
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><button type="button" disabled={Boolean(submittingId)} onClick={() => { setReviewTarget(null); setRejectionReason(''); setActionError('') }} className="min-h-11 rounded-lg px-4 text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed">Cancel</button><button type="submit" disabled={Boolean(submittingId)} className="min-h-11 rounded-lg bg-red-600 px-4 text-sm font-bold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70">{submittingId ? 'Rejecting...' : 'Reject document'}</button></div>
            </form>
          </div>
        )}
      </div>
    </main>
  )
}

export default AdminDashboard
