import api from '../axios'
import { type Asset } from './assets'

export interface TradeRequest {
  assetId: string
  quantity: number
  type: 'BUY' | 'SELL'
}

export interface TradeResponse {
  _id: string
  userId: string
  assetId: Asset
  quantity: number
  updatedAt: string
  createdAt: string
  __v: number
}

export const executeTrade = async (tradeRequest: TradeRequest): Promise<TradeResponse> => {
  const token = localStorage.getItem('token')
  const response = await api.post<TradeResponse>('/holdings/trade', tradeRequest, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}
