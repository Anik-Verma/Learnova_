import { Navigate } from 'react-router-dom'
import { getStudent } from '../../utils/storage'

export default function ProtectedRoute({ children }) {
  const student = getStudent()
  if (!student) return <Navigate to="/login" replace />
  return children
}
