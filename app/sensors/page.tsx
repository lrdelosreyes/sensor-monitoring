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
  const [formData, setFormData] = useState<any>(null)
  const [feedback, setFeedback] = useState<{
    status: MessageStatus,
    message: string
  } | undefined>()

  useEffect(() => {
    if (localStorage.getItem('logged_in') !== '1') {
      window.location.href = '/'
    } else {
      setLoggedIn(true)
    }
  }, [])

  useEffect(() => {
    setIsLoading(true) 

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
      })
      .finally(() => setIsLoading(false))
  }, [])

  const handleResyncData = async () => {
    setIsLoading(true) 

    await API.fetchPaginatedSensors()
      .then((res: any) => {
        setSensors(res?.data)
      })
      .finally(() => {
        setIsLoading(false)
      })
      .catch(() => {
        setFeedback({
          ...feedback,
          status: 'error',
          message: 'There is a problem fetching the sensors'
        })
      })
  }

  const handlePaginateAction = async (url: string) => {
    setIsLoading(true)

    await API.fetchPaginatedSensors(url)
      .then((res: any) => {
        setSensors(res?.data)
      })
      .finally(() => setIsLoading(false))
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
    <MiniVariantDrawer loggedIn={loggedIn}>
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