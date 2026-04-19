import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type User } from '../api/modules/auth'

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      setUser(JSON.parse(userData))
    } else {
      navigate('/login')
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (!user) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold text-gray-900">
          Dashboard
        </h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p className="text-lg text-gray-600 mb-4">
            Welcome back, {user.name}!
          </p>
          <p className="text-sm text-gray-500 mb-6">
            Email: {user.email}
          </p>
          <div className="space-y-3">
            <button
              onClick={() => navigate('/profile')}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Update Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
