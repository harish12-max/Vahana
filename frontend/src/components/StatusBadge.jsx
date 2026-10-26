const STATUS_STYLES = {
  APPROVED: 'success',
  ACTIVE: 'success',
  COMPLETED: 'complete',
  PENDING: 'warning',
  PENDING_PAYMENT: 'warning',
  REJECTED: 'danger',
  SUSPENDED: 'danger',
  CANCELLED: 'neutral',
}

export default function StatusBadge({ status }) {
  const value = typeof status === 'string' && status.trim()
    ? status.trim().toUpperCase()
    : 'UNKNOWN'
  const kind = STATUS_STYLES[value] || 'neutral'
  const label = value.replaceAll('_', ' ').toLowerCase().replace(/\b\w/g, (letter) => letter.toUpperCase())

  return <span className={`status-badge ${kind}`} role="status">{label}</span>
}
