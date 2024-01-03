'use client'

import React, { useEffect, useState } from 'react'
import MiniVariantDrawer from '@/components/Drawer/MiniVariantDrawer'
import { Divider, Stack, Typography } from '@mui/material'
import Loader from '@/components/Loader'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
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
      {isLoading ? (
        <Loader />
      ) : (
        <Stack p={{ xs: 2, sm: 3 }}>
          <Typography variant='h5'>Dashboard</Typography>
          <Divider />
        </Stack>
      )}
      
    </MiniVariantDrawer>
  )
}

export default Dashboard