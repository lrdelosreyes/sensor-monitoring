'use client'

import React, { useEffect, useState } from 'react'
import MiniVariantDrawer from '@/components/Drawer/MiniVariantDrawer'

const Dashboard = () => {
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('logged_in') !== '1') {
      window.location.href = '/'
    } else {
      setLoggedIn(true)
    }
  }, [])

  return (
    <MiniVariantDrawer loggedIn={loggedIn}>
      Dashboard
    </MiniVariantDrawer>
  )
}

export default Dashboard