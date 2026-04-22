import { type Asset } from '../api/modules/assets'

interface AssetCardProps {
  asset: Asset
  onBuy: (asset: Asset) => void
  cryptoPrices?: Array<{ symbol: string; price: number }>
}

const AssetCard = ({ asset, onBuy, cryptoPrices }: AssetCardProps) => {
  const currentPrice = cryptoPrices?.find(price => price.symbol === asset.baseCrypto)?.price;
  
  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {asset.name}
          </h3>
          <p className="text-sm text-gray-600 uppercase">
            {asset.symbol}
          </p>
        </div>
        <div className="text-right">
          {currentPrice && (
            <p className="text-lg font-semibold text-green-600">
              ${currentPrice.toLocaleString()}
            </p>
          )}
          <p className="text-xs text-gray-500">
            Base: {asset.baseCrypto}
          </p>
          <p className="text-xs text-gray-500">
            Multiplier: {asset.priceMultiplier}
          </p>
        </div>
      </div>
      
      <button
        onClick={() => onBuy(asset)}
        className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Buy
      </button>
    </div>
  )
}

export default AssetCard
