import { useState } from 'react'
import { type Asset } from '../api/modules/assets'

interface TradeModalProps {
  asset: Asset
  type: 'BUY' | 'SELL'
  onClose: () => void
  onConfirm: (quantity: number) => void
}

const TradeModal = ({ asset, type, onClose, onConfirm }: TradeModalProps) => {
  const [quantity, setQuantity] = useState<number>(1)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (quantity <= 0) return
    
    setLoading(true)
    try {
      await onConfirm(quantity)
      onClose()
    } catch (error) {
      console.error('Trade failed:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {type === 'BUY' ? 'Buy' : 'Sell'} {asset.name}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-2">
              Quantity
            </label>
            <input
              id="quantity"
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4 p-3 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-600">
              <span className="font-medium">Asset:</span> {asset.name}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Symbol:</span> {asset.symbol}
            </p>
            <p className="text-sm text-gray-600">
              <span className="font-medium">Base:</span> {asset.baseCrypto}
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="submit"
              disabled={loading}
              className={`flex-1 py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                type === 'BUY' 
                  ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500' 
                  : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
              }`}
            >
              {loading ? 'Processing...' : `Confirm ${type}`}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TradeModal
