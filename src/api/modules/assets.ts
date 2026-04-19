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

export const getAssets = async (): Promise<Asset[]> => {
  const token = localStorage.getItem('token')
  const response = await api.get<Asset[]>('/assets', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
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
