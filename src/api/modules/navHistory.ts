import api from "../axios"

export interface NavHistoryItem {
  _id: string
  userId: string
  nav: number
  timestamp: string
  __v: number
}

export interface NavHistoryResponse {
  userId: string
  history: NavHistoryItem[]
}

export const getNavHistory = async (): Promise<NavHistoryResponse> => {
  const token = localStorage.getItem("token")
  const response = await api.get<NavHistoryResponse>("/nav/history", {
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
