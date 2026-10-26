
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axiosInstance from '../api/axiosInstance'
import { useAuth } from '../context/AuthContext.jsx'
import StatusBadge from '../components/StatusBadge.jsx'

const errorText = (error) =>
  error.response?.data?.error?.message ||
  'We could not load your dashboard.'

const Stat = ({ label, value, tone = 'navy' }) => (
  <article className={`dashboard-stat ${tone}`}>
    <p>{label}</p>
    <strong>
      {typeof value === 'string' &&
      [
        'APPROVED',
        'ACTIVE',
        'COMPLETED',
        'PENDING',
        'PENDING_PAYMENT',
        'REJECTED',
        'CANCELLED',
        'SUSPENDED'
      ].includes(value.toUpperCase()) ? (
        <StatusBadge status={value} />
      ) : (
        value
      )}
    </strong>
  </article>
)

export default function Dashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let alive = true

    const load = async () => {
      try {
        if (user.role === 'ADVERTISER') {
          const response = await axiosInstance.get(
            '/campaigns/advertiser'
          )

          if (alive) {
            setData({
              campaigns: response.data?.data?.campaigns || []
            })
          }
        } else if (user.role === 'AUTO_OWNER') {
          const [profile, vehicles, participations] =
            await Promise.all([
              axiosInstance
                .get('/profiles/auto-owner')
                .catch(() => null),
              axiosInstance.get('/vehicles'),
              axiosInstance.get('/campaigns/participations/me')
            ])

          if (alive) {
            setData({
              profile: profile?.data?.data?.profile,
              vehicles: vehicles.data?.data?.vehicles || [],
              participations:
                participations.data?.data?.participations || []
            })
          }
        } else {
          const [campaigns, overview, vehicles] =
            await Promise.all([
              axiosInstance.get('/admin/campaigns'),
              axiosInstance.get('/admin/users-overview'),
              axiosInstance.get('/admin/vehicles')
            ])

          if (alive) {
            setData({
              campaigns: campaigns.data?.data?.campaigns || [],
              overview: overview.data?.data || {},
              vehicles: vehicles.data?.data?.vehicles || []
            })
          }
        }
      } catch (requestError) {
        if (alive) {
          setError(errorText(requestError))
        }
      }
    }

    load()

    return () => {
      alive = false
    }
  }, [user.role])

  const advertiser = user.role === 'ADVERTISER'
  const owner = user.role === 'AUTO_OWNER'
  const campaigns = data?.campaigns || []

  const stats = advertiser
    ? [
        ['Total Campaigns', campaigns.length],
        [
          'Approved Campaigns',
          campaigns.filter((c) => c.status === 'APPROVED').length,
          'green'
        ],
        [
          'Pending Campaigns',
          campaigns.filter((c) => c.status === 'PENDING').length,
          'amber'
        ],
        [
          'Joined Drivers',
          campaigns.reduce(
            (sum, c) => sum + (c.participantCount || 0),
            0
          ),
          'blue'
        ]
      ]
    : owner
      ? [
          [
            'Profile Status',
            data?.profile?.verificationStatus || 'Pending',
            data?.profile?.verificationStatus === 'APPROVED'
              ? 'green'
              : 'amber'
          ],
          [
            'Vehicle Status',
            data?.vehicles?.some(
              (v) => v.verificationStatus === 'APPROVED'
            )
              ? 'Approved'
              : 'Pending',
            'blue'
          ],
          [
            'Active Campaigns',
            data?.participations?.filter(
              (p) => p.status === 'ACTIVE'
            ).length || 0,
            'green'
          ],
          [
            'Total Joined',
            data?.participations?.length || 0,
            'navy'
          ]
        ]
      : [
          [
            'Pending Campaigns',
            campaigns.filter((c) => c.status === 'PENDING').length,
            'amber'
          ],
          [
            'Total Advertisers',
            data?.overview?.advertisers?.length || 0,
            'blue'
          ],
          [
            'Total Auto-owners',
            data?.overview?.autoOwners?.length || 0,
            'green'
          ],
          ['Total Vehicles', data?.vehicles?.length || 0, 'navy']
        ]

  const quickLinks = advertiser
    ? [
        ['Create New Campaign', '/advertiser/campaigns'],
        ['Business Profile', '/advertiser/profile']
      ]
    : owner
      ? [
          ['View Profile', '/auto-owner/profile'],
          ['Manage Vehicles', '/vehicles'],
          ['Upload Documents', '/vehicle-documents'],
          ['Find Campaigns', '/auto-owner/campaigns']
        ]
      : [
          ['Review Campaigns', '/admin/campaigns'],
          ['Review Vehicles', '/admin'],
          ['View Users', '/admin/users']
        ]

  return (
    <main className="min-h-screen px-5 py-8 text-slate-900 sm:px-8 sm:py-10">
      <div className="mx-auto">
        <header className="page-header">
          <p>WELCOME BACK</p>
          <h1>{user.name}, here’s your overview.</h1>
          <span>
            {advertiser
              ? 'Manage campaigns and discover the drivers bringing your brand to the road.'
              : owner
                ? 'Keep your profile ready and find the right advertising campaign.'
                : 'Review submissions and keep the Vahana network moving.'}
          </span>
        </header>

        {error ? (
          <p role="alert" className="app-alert danger">
            {error}
          </p>
        ) : !data ? (
          <p className="loading-copy">Loading dashboard…</p>
        ) : (
          <>
            <section className="stat-grid">
              {stats.map(([label, value, tone]) => (
                <Stat
                  key={label}
                  label={label}
                  value={value}
                  tone={tone}
                />
              ))}
            </section>

            <section className="dashboard-panel">
              <div className="panel-heading">
                <div>
                  <p className="eyebrow">QUICK ACTIONS</p>
                  <h2>Keep work moving</h2>
                </div>
              </div>

              <div className="quick-grid">
                {quickLinks.map(([label, to]) => (
                  <Link
                    key={to}
                    to={to}
                    className="quick-card"
                  >
                    <span
                      className="quick-icon"
                      aria-hidden="true"
                    />
                    {label}
                    <small>Open</small>
                  </Link>
                ))}
              </div>
            </section>

            {advertiser && (
              <section className="dashboard-panel">
                <div className="panel-heading">
                  <div>
                    <p className="eyebrow">CAMPAIGNS</p>
                    <h2>Recent campaigns</h2>
                  </div>

                  <Link
                    to="/advertiser/campaigns"
                    className="text-sm font-bold text-blue-600"
                  >
                    View all
                  </Link>
                </div>

                {campaigns.length ? (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Campaign</th>
                          <th>Target</th>
                          <th>Autos</th>
                          <th>Status</th>
                        </tr>
                      </thead>

                      <tbody>
                        {campaigns.slice(0, 5).map((campaign) => (
                          <tr key={campaign._id}>
                            <td>{campaign.title}</td>
                            <td>
                              {campaign.city}, {campaign.locality}
                            </td>
                            <td>
                              {campaign.participantCount}/
                              {campaign.requestedAutoCount}
                            </td>
                            <td>
                              <StatusBadge status={campaign.status} />
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="empty-copy">
                    Create your first campaign to begin.
                  </p>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </main>
  )
}
