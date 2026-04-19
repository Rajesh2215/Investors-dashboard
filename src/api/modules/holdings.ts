import api from '../axios'

export interface Asset {
  _id: string
  name: string
  symbol: string
  baseCrypto: string
  priceMultiplier: number
  createdAt: string
  updatedAt: string
  __v: number
}

export interface Holding {
  _id: string
  userId: string
  assetId: Asset
  quantity: number
  updatedAt: string
  createdAt: string
  __v: number
}

export const getHoldings = async (): Promise<Holding[]> => {
  const token = localStorage.getItem('token')
  const response = await api.get<Holding[]>('/holdings', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}
