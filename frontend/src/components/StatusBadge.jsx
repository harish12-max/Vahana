export default function StatusBadge({ status }) {
  const value = status || 'PENDING'
  const kind = value === 'APPROVED' || value === 'ACTIVE' || value === 'COMPLETED' ? 'success' : value === 'REJECTED' || value === 'CANCELLED' ? 'danger' : 'warning'
  return <span className={`status-badge ${kind}`}>{value.charAt(0) + value.slice(1).toLowerCase()}</span>
}
