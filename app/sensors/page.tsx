'use client'

import React, { useEffect, useState } from 'react'
import MiniVariantDrawer from '@/components/Drawer/MiniVariantDrawer'
import { Alert, Button, Divider, Snackbar, Stack, Typography } from '@mui/material'
import SensorList from '@/components/SensorList'
import CreateUpdateModal from '@/components/Modal/CreateUpdateModal'
import Loader from '@/components/Loader'
import API from '@/utilities/API'

type MessageStatus = 'success' | 'error'

const Sensors = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [loggedIn, setLoggedIn] = useState(false)
  const [sensors, setSensors] = useState<any>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [formData, setFormData] = useState<any>(null)
  const [user, setUser] = useState<any>()
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
      const data = await API.fetchPaginatedSensors()
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

  const handleResyncData = async () => {
    handleLoading(true) 

    await API.fetchPaginatedSensors()
      .then((res: any) => {
        setSensors(res?.data)
      })
      .finally(() => {
        handleLoading(false)
      })
      .catch(() => {
        setFeedback({
          ...feedback,
          status: 'error',
          message: 'There is a problem fetching the sensors'
        })
        handleLoading(false)
      })
  }

  const handlePaginateAction = async (url: string) => {
    handleLoading(true)

    await API.fetchPaginatedSensors(url)
      .then((res: any) => {
        setSensors(res?.data)
      })
      .finally(() => handleLoading(false))
      .catch(() => {
        setFeedback({
          ...feedback,
          status: 'error',
          message: 'There is a problem fetching the sensors'
        })
        handleResyncData()
      })
  }

  const handleShowModal = (id: string | null) => {
    setIsModalOpen(true)
    
    if (id === null) {
      setFormData(null)
    } else {
      setFormData(
        sensors.data.find((sensor: any) => sensor.id === id) ?? null
      )
    }
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setFormData(null)
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
          <Stack flexDirection='row'>
            <Typography variant='h5' flex={1}>Sensors</Typography>
            <Button 
              onClick={() => handleShowModal(null)}
              sx={{ fontWeight: '700' }}
            >Add Sensor</Button>
          </Stack>
          <Divider sx={{ mb: 2 }} />
          <SensorList 
            data={sensors}
            handlePaginateAction={handlePaginateAction}
            handleShowModal={handleShowModal}
          />
          <CreateUpdateModal 
            sensorData={formData}
            isModalOpen={isModalOpen}
            handleCloseModal={handleCloseModal}
            handleLoading={handleLoading}
            handleResyncData={handleResyncData}
            handleFeedback={handleFeedback}
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

export default Sensors