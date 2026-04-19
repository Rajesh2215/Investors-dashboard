import { type Holding } from '../api/modules/holdings'

interface HoldingsListProps {
  holdings: Holding[]
  loading?: boolean
  onSell?: (holding: Holding) => void
  cryptoPrices?: Array<{ symbol: string; price: number }>
}

const HoldingsList = ({ holdings, loading = false, onSell, cryptoPrices = [] }: HoldingsListProps) => {

  const calculateValue = (holding: Holding) => {
    const priceData = cryptoPrices.find(p => p.symbol === holding.assetId.baseCrypto)
    if (!priceData) return 0
    
    const price = priceData.price
    const multiplier = holding.assetId.priceMultiplier
    const value = holding.quantity * (price * multiplier)
    return value
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-4">
        Holdings
      </h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Asset Name
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Quantity
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Value
              </th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  Loading holdings...
                </td>
              </tr>
            ) : holdings.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-8 text-center text-gray-400">
                  No holdings found
                </td>
              </tr>
            ) : (
              holdings.map((holding) => (
                <tr key={holding._id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {holding.assetId.name}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {holding.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    ${calculateValue(holding).toFixed(2)}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    <button
                      onClick={() => onSell && onSell(holding)}
                      className="px-3 py-1 text-xs font-medium text-white bg-red-600 hover:bg-red-700 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      Sell
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default HoldingsList
