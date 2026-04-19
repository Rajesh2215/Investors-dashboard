import { type TransactionWithAsset } from '../api/modules/transactions'

interface TransactionsListProps {
  transactions: TransactionWithAsset[]
  loading?: boolean
}

const TransactionsList = ({ transactions, loading = false }: TransactionsListProps) => {
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
        Transaction History
      </h3>
      
      {loading ? (
        <div className="text-center py-8 text-gray-400">
          Loading transactions...
        </div>
      ) : transactions.length === 0 ? (
        <div className="text-center py-8 text-gray-400">
          No transactions yet
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Asset
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Type
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Quantity
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Price
                </th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction) => (
                <tr key={transaction._id} className="border-b border-gray-100">
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {transaction.assetId.name}
                  </td>
                  <td className="py-3 px-4 text-sm">
                    <span
                      className={`font-medium ${
                        transaction.type === 'BUY'
                          ? 'text-green-600'
                          : 'text-red-600'
                      }`}
                    >
                      {transaction.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {transaction.quantity}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {transaction.priceAtExecution
                      ? `$${
                          transaction.priceAtExecution * transaction.assetId.priceMultiplier
                        }`
                      : '-'}
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-900">
                    {formatDate(transaction.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default TransactionsList
