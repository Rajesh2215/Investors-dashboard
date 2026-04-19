import api from "../axios"

export interface Alert {
  _id: string
  userId: string
  thresholdValue: number
  direction: 'above' | 'below'
  lastState: 'above' | 'below' | 'triggered'
  createdAt: string
  updatedAt: string
  __v: number
}

export interface AlertResponse {
  userId: string
  alerts: Alert[]
  count: number
}

export interface CreateAlertRequest {
  thresholdValue: number
  direction: 'above' | 'below'
}

export interface CreateAlertResponse {
  message: string
  alert: Alert
}

export const createAlert = async (data: CreateAlertRequest): Promise<CreateAlertResponse> => {
  const token = localStorage.getItem("token")
  const response = await api.post<CreateAlertResponse>('/alerts', data, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
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

export const getAlerts = async (userId: string): Promise<AlertResponse> => {
  const token = localStorage.getItem("token")
  const response = await api.get<AlertResponse>(`/alerts/${userId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
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

export const deleteAlert = async (alertId: string): Promise<void> => {
  const token = localStorage.getItem("token")
  const response = await api.delete(`/alerts/${alertId}`, {
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  })
  
  if (response.status === 401 || response.status === 403) {
    // Token expired or invalid, clear storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
    throw new Error('Token expired');
  }
}
