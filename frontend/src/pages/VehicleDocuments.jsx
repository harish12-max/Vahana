import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import LogoutButton from '../components/LogoutButton.jsx'

const maxFileSize = 5 * 1024 * 1024
const allowedFileTypes = ['application/pdf', 'image/jpeg', 'image/png']
const documentTypes = [
  { value: 'REGISTRATION_CERTIFICATE', label: 'Registration Certificate' },
  { value: 'INSURANCE_CERTIFICATE', label: 'Insurance Certificate' },
  { value: 'VEHICLE_PERMIT', label: 'Vehicle Permit' },
  { value: 'DRIVING_LICENSE', label: 'Driving License' },
]

const getErrorMessage = (error, fallback) =>
  error.response?.data?.error?.message || fallback

const formatStatus = (status) =>
  status ? `${status.charAt(0)}${status.slice(1).toLowerCase()}` : 'Pending'

const formatFileSize = (size) => {
  if (!Number.isFinite(size)) return 'Unknown size'
  if (size < 1024 * 1024) return `${Math.ceil(size / 1024)} KB`

  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

const getDownloadErrorMessage = async (error) => {
  if (error.response?.data instanceof Blob) {
    try {
      const body = JSON.parse(await error.response.data.text())
      return body?.error?.message
    } catch {
      return undefined
    }
  }

  return getErrorMessage(error)
}

function VehicleDocuments() {
  const [vehicles, setVehicles] = useState([])
  const [selectedVehicleId, setSelectedVehicleId] = useState('')
  const [documents, setDocuments] = useState([])
  const [documentType, setDocumentType] = useState(documentTypes[0].value)
  const [file, setFile] = useState(null)
  const [loadingVehicles, setLoadingVehicles] = useState(true)
  const [loadingDocuments, setLoadingDocuments] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [documentError, setDocumentError] = useState('')
  const [uploadError, setUploadError] = useState('')
  const [downloadError, setDownloadError] = useState('')
  const [uploading, setUploading] = useState(false)
  const [downloadingId, setDownloadingId] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    const loadVehicles = async () => {
      try {
        const response = await axiosInstance.get('/vehicles')
        const savedVehicles = response.data?.data?.vehicles

        if (!Array.isArray(savedVehicles)) {
          throw new Error('Vehicle data was unavailable.')
        }

        setVehicles(savedVehicles)
      } catch (error) {
        setLoadError(getErrorMessage(error, 'We could not load your vehicles. Please try again.'))
      } finally {
        setLoadingVehicles(false)
      }
    }

    loadVehicles()
  }, [])

  const loadDocuments = async (vehicleId) => {
    if (!vehicleId) {
      setDocuments([])
      return
    }

    setLoadingDocuments(true)
    setDocumentError('')

    try {
      const response = await axiosInstance.get(`/vehicles/${vehicleId}/documents`)
      const savedDocuments = response.data?.data?.documents

      if (!Array.isArray(savedDocuments)) {
        throw new Error('Document data was unavailable.')
      }

      setDocuments(savedDocuments)
    } catch (error) {
      setDocuments([])
      setDocumentError(getErrorMessage(error, 'We could not load this vehicle’s documents. Please try again.'))
    } finally {
      setLoadingDocuments(false)
    }
  }

  const handleVehicleChange = (event) => {
    const vehicleId = event.target.value
    setSelectedVehicleId(vehicleId)
    setSuccess('')
    setUploadError('')
    setDownloadError('')
    loadDocuments(vehicleId)
  }

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0] || null
    setFile(selectedFile)
    setUploadError('')
    setSuccess('')
  }

  const validateUpload = () => {
    if (!selectedVehicleId) return 'Please select a vehicle before uploading a document.'
    if (!file) return 'Please choose a document file.'
    if (!allowedFileTypes.includes(file.type)) return 'Choose a PDF, JPEG, or PNG document.'
    if (file.size < 1 || file.size > maxFileSize) return 'Document files must be no larger than 5 MB.'
    if (file.name.length > 255 || file.name.includes('..') || /[\\/]/.test(file.name) || file.name.startsWith('.')) {
      return 'Please choose a document file with a valid filename.'
    }

    return ''
  }

  const handleUpload = async (event) => {
    event.preventDefault()
    if (uploading) return

    const validationError = validateUpload()
    if (validationError) {
      setUploadError(validationError)
      return
    }

    const formData = new FormData()
    formData.append('documentType', documentType)
    formData.append('file', file)

    setUploading(true)
    setUploadError('')
    setSuccess('')

    try {
      const response = await axiosInstance.post(`/vehicles/${selectedVehicleId}/documents`, formData)
      const savedDocument = response.data?.data?.document

      if (!savedDocument) {
        throw new Error('The document was uploaded but no document data was returned.')
      }

      setFile(null)
      await loadDocuments(selectedVehicleId)
      setSuccess('Document uploaded successfully. It is pending review.')
    } catch (error) {
      setUploadError(getErrorMessage(error, 'We could not upload your document. Please try again.'))
    } finally {
      setUploading(false)
    }
  }

  const handleDownload = async (document) => {
    if (!selectedVehicleId || downloadingId) return

    setDownloadingId(document._id)
    setDownloadError('')

    try {
      const response = await axiosInstance.get(
        `/vehicles/${selectedVehicleId}/documents/${document._id}/file`,
        { responseType: 'blob' },
      )
      const downloadUrl = URL.createObjectURL(response.data)
      const link = window.document.createElement('a')
      link.href = downloadUrl
      link.download = document.originalFilename
      link.click()
      URL.revokeObjectURL(downloadUrl)
    } catch (error) {
      setDownloadError(await getDownloadErrorMessage(error) || 'We could not download this document. Please try again.')
    } finally {
      setDownloadingId('')
    }
  }

  const selectedVehicle = vehicles.find(({ _id }) => _id === selectedVehicleId)

  if (loadingVehicles) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-[#102a43]">
        <p className="text-sm font-semibold">Loading your vehicles...</p>
      </main>
    )
  }

  if (loadError) {
    return (
      <main className="grid min-h-screen place-items-center bg-slate-50 px-5 text-slate-900">
        <section className="w-full max-w-lg rounded-2xl border border-red-200 bg-white p-7 shadow-xl shadow-slate-900/5">
          <p className="text-sm font-bold tracking-[0.14em] text-amber-600">VAHANA</p>
          <h1 className="mt-3 text-2xl font-black text-[#102a43]">Documents unavailable</h1>
          <p role="alert" className="mt-3 text-sm leading-6 text-slate-600">{loadError}</p>
          <div className="mt-6 flex flex-wrap items-start justify-between gap-4">
            <Link to="/dashboard" className="inline-flex rounded-lg bg-[#102a43] px-4 py-2.5 text-sm font-bold text-white transition hover:bg-[#183b5b]">Return to dashboard</Link>
            <LogoutButton className="text-[#102a43]" />
          </div>
        </section>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[#102a43]">
          <span aria-hidden="true">&larr;</span>
          Back to dashboard
        </Link>

        <header className="mt-8 rounded-2xl bg-[#102a43] p-6 text-white shadow-xl shadow-slate-900/15 sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-bold tracking-[0.14em] text-amber-300">VEHICLE DOCUMENTS</p>
              <h1 className="mt-3 text-3xl font-black tracking-tight sm:text-4xl">Manage your documents</h1>
            </div>
            <LogoutButton />
          </div>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">Upload documents for your registered vehicles and track their review status.</p>
        </header>

        {success && <p role="status" className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{success}</p>}

        {vehicles.length === 0 ? (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-xl shadow-slate-900/5">
            <h2 className="text-xl font-black text-[#102a43]">No registered vehicles</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Register a vehicle before uploading its documents.</p>
            <Link to="/vehicles" className="mt-6 inline-flex min-h-11 items-center rounded-lg bg-[#102a43] px-4 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b]">Manage vehicles</Link>
          </section>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" aria-labelledby="upload-heading">
              <h2 id="upload-heading" className="text-xl font-black text-[#102a43]">Upload a document</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">PDF, JPEG, or PNG files up to 5 MB are accepted.</p>
              <form className="mt-6" noValidate onSubmit={handleUpload}>
                {uploadError && <p role="alert" className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{uploadError}</p>}
                <label htmlFor="vehicle" className="mb-2 block text-sm font-bold text-slate-700">Vehicle</label>
                <select id="vehicle" value={selectedVehicleId} onChange={handleVehicleChange} className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10">
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle) => <option key={vehicle._id} value={vehicle._id}>{vehicle.registrationNumber} — {vehicle.vehicleType}</option>)}
                </select>

                <label htmlFor="documentType" className="mb-2 mt-5 block text-sm font-bold text-slate-700">Document type</label>
                <select id="documentType" value={documentType} onChange={(event) => { setDocumentType(event.target.value); setUploadError(''); setSuccess('') }} className="min-h-12 w-full rounded-lg border border-slate-300 bg-white px-4 text-sm outline-none transition focus:border-[#102a43] focus:ring-4 focus:ring-[#102a43]/10">
                  {documentTypes.map((type) => <option key={type.value} value={type.value}>{type.label}</option>)}
                </select>

                <label htmlFor="file" className="mb-2 mt-5 block text-sm font-bold text-slate-700">Document file</label>
                <input id="file" type="file" accept=".pdf,image/jpeg,image/png" onChange={handleFileChange} className="block w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-sm text-slate-700 file:mr-4 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-bold file:text-[#102a43] hover:file:bg-slate-200" />
                <button type="submit" disabled={uploading} className="mt-7 inline-flex min-h-12 w-full items-center justify-center rounded-lg bg-[#102a43] px-5 text-sm font-bold text-white shadow-lg shadow-slate-900/15 transition hover:bg-[#183b5b] disabled:cursor-not-allowed disabled:opacity-70">
                  {uploading ? 'Uploading...' : 'Upload document'}
                </button>
              </form>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-xl shadow-slate-900/5 sm:p-8" aria-labelledby="document-list-heading">
              <h2 id="document-list-heading" className="text-xl font-black text-[#102a43]">{selectedVehicle ? `${selectedVehicle.registrationNumber} documents` : 'Vehicle documents'}</h2>
              {!selectedVehicle ? (
                <p className="mt-4 text-sm leading-6 text-slate-600">Select a vehicle to view its documents and missing document types.</p>
              ) : loadingDocuments ? (
                <div className="grid min-h-64 place-items-center"><p className="text-sm font-semibold text-[#102a43]">Loading documents...</p></div>
              ) : documentError ? (
                <p role="alert" className="mt-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{documentError}</p>
              ) : (
                <div className="mt-5 space-y-3">
                  {downloadError && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{downloadError}</p>}
                  {documents.map((document) => {
                    const type = documentTypes.find(({ value }) => value === document.documentType)

                    return (
                      <article key={document._id} className="rounded-xl border border-slate-200 p-4">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <h3 className="font-bold text-[#102a43]">{type?.label || document.documentType}</h3>
                            <p className="mt-1 break-all text-sm text-slate-600">{document.originalFilename} · {formatFileSize(document.fileSize)}</p>
                            <p className="mt-2 text-sm font-semibold text-slate-700">Status: {formatStatus(document.verificationStatus)}</p>
                            {document.verificationStatus === 'REJECTED' && document.rejectionReason && <p className="mt-2 text-sm leading-6 text-red-700">Reason: {document.rejectionReason}</p>}
                          </div>
                          <button type="button" disabled={Boolean(downloadingId)} onClick={() => handleDownload(document)} className="inline-flex min-h-10 items-center justify-center rounded-lg border border-[#102a43] px-3 text-sm font-bold text-[#102a43] transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70">
                            {downloadingId === document._id ? 'Downloading...' : 'Download'}
                          </button>
                        </div>
                      </article>
                    )
                  })}
                  {documentTypes.filter((type) => !documents.some(({ documentType: value }) => value === type.value)).map((type) => (
                      <div key={type.value} className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4">
                        <p className="font-bold text-slate-700">{type.label}</p>
                        <p className="mt-1 text-sm text-slate-600">Not uploaded</p>
                      </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </div>
    </main>
  )
}

export default VehicleDocuments
