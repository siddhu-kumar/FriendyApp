import React from 'react'
import { isLoggedIn } from '.'
import { Outlet, Navigate } from 'react-router-dom'

const ProtectedRoute = () => {
  return isLoggedIn() ? <Outlet></Outlet> : <Navigate to="/login" />
}

export default ProtectedRoute