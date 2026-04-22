interface NavCardProps {
  nav: number
  loading?: boolean
}

const NavCard = ({ nav, loading = false }: NavCardProps) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-700 mb-2">
        Total NAV
      </h3>
      <p className="text-3xl font-bold text-gray-900">
        {loading ? (
          <span className="text-gray-400">Loading...</span>
        ) : (
          formatCurrency(nav)
        )}
      </p>
    </div>
  )
}

export default NavCard
