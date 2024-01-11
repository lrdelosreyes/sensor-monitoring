'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Map from '@/components/Map'
import Navbar from '@/components/Navigation/Navbar'
import LeftDrawer from '@/components/Drawer/LeftDrawer'
import { Alert, Box, Snackbar } from '@mui/material'
import Loader from '@/components/Loader'
import API from '@/utilities/API'
import LoginModal from '@/components/Modal/LoginModal'

type SortBy = 'all' | 'rain' | 'waterlevel'
type MessageStatus = 'success' | 'error'

export default function Home() {
  const searchParams = useSearchParams()
  const [sensors, setSensors] = useState<any>([])
  const [sortedSensors, setSortedSensors] = useState<any>([])
  const [isLoading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>('all')
  const [loggedIn, setLoggedIn] = useState(false)
  const [user, setUser] = useState<any>()
  const [feedback, setFeedback] = useState<{
    status: MessageStatus,
    message: string
  } | undefined>()

  useEffect(() => {
    const logout = searchParams.get('logout') === '1'

    if (!!logout) handleLogout()
  })

  useEffect(() => {
    handleLoading(true)
    const getUser = async () => {
      const data = await API.me()

      if (data?.data) {
        setLoggedIn(true)
        setUser(data.data)
      }
    }

    getUser()
      .catch(() => {
        handleFeedback({
          status: 'error',
          message: 'There was a problem fetching the user.'
        })
        handleLoading(false)
      })
      .finally(() => handleLoading(false))
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

  const handleShowLogin = () => {
    setIsModalOpen(true)
  }

  const handleLogout = () => {
    localStorage.removeItem('access_token')
    window.location.href = '/'
  }

  const handleFeedback = (feed: {
    status: MessageStatus,
    message: string
  } | undefined) => {
    setFeedback(feed)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleLoading = (loading: boolean) => {
    setLoading(loading)
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
          firstName={user?.first_name ?? ''}
          lastName={user?.last_name ?? ''}
          toggleDrawer={toggleDrawer} 
          handleLogin={!loggedIn ? handleShowLogin : undefined}
          loggedIn={loggedIn} 
        />
        <Map 
          sensors={sortedSensors} 
          isLoading={isLoading} 
        />
        <LoginModal 
          isModalOpen={isModalOpen}
          handleCloseModal={handleCloseModal}
          handleLoading={handleLoading}
          handleFeedback={handleFeedback}
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
