'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Map from '@/components/Map'
import Navbar from '@/components/Navigation/Navbar'
import LeftDrawer from '@/components/Drawer/LeftDrawer'
import { Alert, Box, Snackbar } from '@mui/material'
import Loader from '@/components/Loader'
import API from '@/utilities/API'

type SortBy = 'all' | 'rain' | 'waterlevel'
type MessageStatus = 'success' | 'error'

export default function Home() {
  const searchParams = useSearchParams()
  const [sensors, setSensors] = useState<any>([])
  const [sortedSensors, setSortedSensors] = useState<any>([])
  const [isLoading, setLoading] = useState(true)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>('all')
  const [loggedIn, setLoggedIn] = useState(false)
  const [feedback, setFeedback] = useState<{
    status: MessageStatus,
    message: string
  } | undefined>()

  useEffect(() => {
    const logout = searchParams.get('logout') === '1'

    if (!!logout) handleLogout()
  })

  useEffect(() => {
    if (localStorage.getItem('logged_in') === '1') setLoggedIn(true)
  }, [])

  useEffect(() => {
    setLoading(true)

    const fetchData = async () => {
      const data = await API.fetchSensors()
      setSensors(data?.data)
    }

    fetchData()
      .catch(() => {
        setFeedback({
          ...feedback,
          status: 'error',
          message: 'There is a problem fetching the sensors'
        })
        setLoading(false)
      })
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (sortBy === 'all') {
      setSortedSensors(sensors)
    } else {
      setSortedSensors(sensors.filter((sensor: any) => sensor.type === sortBy))
    }
  }, [sortBy, sensors])

  const toggleDrawer = (toggle: boolean) => {
    setIsOpenDrawer(toggle)
  }

  const toggleSort = (sortValue: SortBy) => {
    setSortBy(sortValue)
  }

  const handleLogin = () => {
    localStorage.setItem('logged_in', '1')
    window.location.href = '/dashboard'
  }

  const handleLogout = () => {
    localStorage.removeItem('logged_in')
    window.location.href = '/'
  }

  const handleFeedback = (feed: {
    status: MessageStatus,
    message: string
  } | undefined) => {
    setFeedback(feed)
  }

  return (
    <Suspense fallback={<Loader />}>
      <Box height="100vh">
        <LeftDrawer 
          toggleSort={toggleSort}
          toggleDrawer={toggleDrawer} 
          isOpenDrawer={isOpenDrawer} 
          sortBy={sortBy}
        />
        <Navbar 
          toggleDrawer={toggleDrawer} 
          handleLogin={handleLogin}
          loggedIn={loggedIn} 
        />
        <Map 
          sensors={sortedSensors} 
          isLoading={isLoading} 
        />
      </Box>

      <Snackbar 
        open={feedback ? true : false} 
        autoHideDuration={3000} 
        onClose={() => handleFeedback(undefined)}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => handleFeedback(undefined)} 
          severity={feedback?.status}
          sx={{ width: '100%' }}>
          {feedback?.message}
        </Alert>
      </Snackbar>
    </Suspense>
  )
}
