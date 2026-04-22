import api from '../axios'

export interface RegisterData {
  name: string
  email: string
  password: string
}

export interface LoginData {
  email: string
  password: string
}

export interface UpdateProfileData {
  name?: string
  email?: string
}

export interface User {
  _id: string
  name: string
  email: string
  createdAt: string
  updatedAt: string
}

export interface AuthResponse {
  user: User
  token: string
}

export const registerUser = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/users/register', data)
  return response.data
}

export const loginUser = async (data: LoginData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/users/login', data)
  return response.data
}

export const updateProfile = async (userId: string, data: UpdateProfileData): Promise<User> => {
  const token = localStorage.getItem('token')
  const response = await api.patch<User>(`/users/${userId}`, data, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  return response.data
}

export const getUsers = async () => {
  const response = await api.get<User[]>('/users')
  return response.data
}

export const logoutUser = async (): Promise<void> => {
  const token = localStorage.getItem('token')
  await api.post('/users/logout', {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
}
