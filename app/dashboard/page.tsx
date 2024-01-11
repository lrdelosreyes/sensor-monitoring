'use client'

import React, { useEffect, useState } from 'react'
import MiniVariantDrawer from '@/components/Drawer/MiniVariantDrawer'
import { Alert, Box, Divider, Snackbar, Stack, Typography } from '@mui/material'
import Loader from '@/components/Loader'
import DashboardCards from '@/components/DashboardCards'
import API from '@/utilities/API'
import DataTable from '@/components/DataTable'
import DetailsModal from '@/components/Modal/DetailsModal'

type MessageStatus = 'success' | 'error'

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [sensors, setSensors] = useState<any>([])
  const [sensorDetails, setSensorDetails] = useState<any>()
  const [isAdmin, setIsAdmin] = useState(false)
  const [user, setUser] = useState<any>()
  const [sensorStats, setSensorStats] = useState<{
    total: number
    total_working: number
    total_down: number
  }>()
  const [feedback, setFeedback] = useState<{
    status: MessageStatus,
    message: string
  } | undefined>()

  useEffect(() => {
    handleLoading(true)
    const getUser = async () => {
      const data = await API.me()

      if (data?.data) {
        setLoggedIn(true)
        setIsAdmin(data?.data.is_admin)
        setUser(data.data)
      } else {
        window.location.href = '/'
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
    handleLoading(true)

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
        handleLoading(false)
      })
      .finally(() => handleLoading(false))
  }, [])

  useEffect(() => {
    if (!sensors) return

    const totalSensors = sensors.length
    const totalWorking = 
      sensors?.filter((sensor: any) => !!sensor.reading === true).length
    const totalDown = 
      sensors?.filter((sensor: any) => !!sensor.reading === false).length

    setSensorStats({
      ...sensorStats,
      total: totalSensors,
      total_working: totalWorking,
      total_down: totalDown
    })
  }, [sensors])

  const handleShowDetails = (id: string) => {
    handleLoading(true)

    API.fetchSensor(id)
      .then((res: any) => setSensorDetails(res?.data))
      .catch(() => {
        setFeedback({
          ...feedback,
          status: 'error',
          message: 'There is a problem fetching a sensor'
        })
        handleLoading(false)
      })
      .finally(() => {
        handleLoading(false)
        setIsModalOpen(true)
      })
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  const handleLoading = (loading: boolean) => {
    setIsLoading(loading)
  }

  const handleFeedback = (feed: {
    status: MessageStatus,
    message: string
  } | undefined) => {
    setFeedback(feed)
  }

  return (
    <MiniVariantDrawer 
      firstName={user?.first_name ?? ''}
      lastName={user?.last_name ?? ''}
      loggedIn={loggedIn} 
      isAdmin={isAdmin}
    >
      {isLoading ? (
        <Loader />
      ) : (
        <Stack p={{ xs: 2, sm: 3 }}>
          <Typography variant='h5'>Dashboard</Typography>
          <Divider sx={{ mb: 2 }} />
          <DashboardCards sensorStats={sensorStats} />
          <Box mt={5}>
            <DataTable 
              data={sensors} 
              handleShowDetails={(id) => handleShowDetails(id)} 
            />
          </Box>
          <DetailsModal 
            sensorData={sensorDetails}
            isModalOpen={isModalOpen}
            handleCloseModal={handleCloseModal}
          />
        </Stack>
      )}
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
    </MiniVariantDrawer>
  )
}

export default Dashboard