import { useState } from 'react'
import { createAlert, type CreateAlertRequest } from '../api/modules/alerts'

interface AlertFormProps {
  onAlertCreated: () => void
}

const AlertForm = ({ onAlertCreated }: AlertFormProps) => {
  const [formData, setFormData] = useState<CreateAlertRequest>({
    thresholdValue: 0,
    direction: 'above'
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    
    try {
      await createAlert(formData)
      setMessage('Alert created successfully!')
      setFormData({ thresholdValue: 0, direction: 'above' })
      onAlertCreated()
    } catch (error) {
      setMessage('Failed to create alert')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'thresholdValue' ? Number(value) : value
    }))
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Create Alert
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="thresholdValue" className="block text-sm font-medium text-gray-700 mb-1">
            Threshold Value
          </label>
          <input
            type="number"
            id="thresholdValue"
            name="thresholdValue"
            value={formData.thresholdValue}
            onChange={handleChange}
            required
            min="0"
            step="0.01"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Enter NAV threshold value"
          />
        </div>

        <div>
          <label htmlFor="direction" className="block text-sm font-medium text-gray-700 mb-1">
            Direction
          </label>
          <select
            id="direction"
            name="direction"
            value={formData.direction}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="above">Above</option>
            <option value="below">Below</option>
          </select>
        </div>

        {message && (
          <div className={`text-sm text-center ${message.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
            {message}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Alert'}
        </button>
      </form>
    </div>
  )
}

export default AlertForm
