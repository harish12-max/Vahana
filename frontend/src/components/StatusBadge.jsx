export default function StatusBadge({ status }) {
  const value = typeof status === 'string' ? status : 'UNKNOWN'
  const kind = { APPROVED: 'success', ACTIVE: 'success', COMPLETED: 'complete', PENDING: 'warning', PENDING_PAYMENT: 'warning', REJECTED: 'danger', SUSPENDED: 'danger', CANCELLED: 'neutral' }[value] || 'neutral'
  return <span className={`status-badge ${kind}`}>{value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())}</span>
}
