import { useState, useEffect } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { getNavHistory, type NavHistoryResponse } from '../api/modules/navHistory'

interface ChartData {
  time: string
  nav: number
}

const NavHistoryChart = () => {
  const [data, setData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNavHistory = async () => {
      try {
        const response: NavHistoryResponse = await getNavHistory()
        
        // Format data for chart
        const chartData: ChartData[] = response.history.map((item) => ({
          time: new Date(item.timestamp).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
          nav: item.nav
        }))
        
        setData(chartData)
      } catch (error) {
        console.error('Failed to fetch NAV history:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchNavHistory()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          NAV History
        </h3>
        <div className="text-center py-8 text-gray-400">
          Loading NAV history...
        </div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-700 mb-4">
          NAV History
        </h3>
        <div className="text-center py-8 text-gray-400">
          No history available
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        NAV History
      </h3>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
            <XAxis 
              dataKey="time" 
              tick={{ fontSize: 12 }}
              interval="preserveStartEnd"
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => ` ${(value / 1000).toFixed(0)}k`}
            />
            <Tooltip 
              formatter={(value: number) => [formatCurrency(value), 'NAV']}
              labelFormatter={(label) => `Time: ${label}`}
            />
            <Line 
              type="monotone" 
              dataKey="nav" 
              stroke="#4f46e5" 
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default NavHistoryChart
