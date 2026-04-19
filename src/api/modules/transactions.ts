import api from "../axios"

export interface Transaction {
  _id: string
  userId: string
  assetId: string
  type: 'BUY' | 'SELL'
  quantity: number
  priceAtExecution: number | null
  createdAt: string
  updatedAt: string
  __v: number
}

export interface TransactionWithAsset {
  _id: string
  userId: string
  assetId: {
    _id: string
    name: string
    symbol: string
    baseCrypto: string
    priceMultiplier: number
  }
  type: 'BUY' | 'SELL'
  quantity: number
  priceAtExecution: number | null
  createdAt: string
  updatedAt: string
  __v: number
}

export const getTransactions = async (): Promise<TransactionWithAsset[]> => {
  const token = localStorage.getItem("token")
  const response = await api.get<TransactionWithAsset[]>(`/transactions`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
  
  if (response.status === 401 || response.status === 403) {
    // Token expired or invalid, clear storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Token expired');
  }
  
  return response.data
}
