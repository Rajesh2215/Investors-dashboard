import { type Alert } from '../api/modules/alerts'

interface AlertsListProps {
  alerts: Alert[]
  loading?: boolean
  onDeleteAlert?: (alertId: string) => void
}

const AlertsList = ({ alerts, loading = false, onDeleteAlert }: AlertsListProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        My Alerts
      </h3>
      
      {loading ? (
        <div className="text-center py-8 text-gray-400">
          Loading alerts...
        </div>
      ) : alerts.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No alerts created
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert._id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="text-sm text-gray-600">
                    Threshold
                  </div>
                  <div className="text-lg font-semibold text-gray-900">
                    {formatCurrency(alert.thresholdValue)}
                  </div>
                  <div className="mt-2 text-xs text-gray-500">
                    Created: {formatDate(alert.createdAt)}
                  </div>
                  {alert.lastState === 'triggered' ? (
                    <div className="mt-1 text-xs text-orange-600 font-medium">
                      ✓ Triggered
                    </div>
                  ) : (
                    <div className="mt-1 text-xs text-green-600 font-medium">
                      ● Active
                    </div>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                      alert.direction === 'above'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {alert.direction.toUpperCase()}
                  </span>
                  {onDeleteAlert && (
                    <button
                      onClick={() => onDeleteAlert(alert._id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      title="Delete alert"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default AlertsList
