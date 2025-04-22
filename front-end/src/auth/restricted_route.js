import React from 'react'
import { isLoggedIn } from '.'
import { Outlet, Navigate } from 'react-router-dom'

const RestrictedRoute = () => {
  return !isLoggedIn() ? <Outlet></Outlet> : <Navigate to="/" />
}

export default RestrictedRoute