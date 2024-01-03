'use client'

import React, { useEffect, useState } from 'react'
import MiniVariantDrawer from '@/components/Drawer/MiniVariantDrawer'
import { Alert, Button, Divider, Snackbar, Stack, Typography } from '@mui/material'
import SensorList from '@/components/SensorList'
import CreateUpdateModal from '@/components/Modal'
import Loader from '@/components/Loader'

type MessageStatus = 'success' | 'error'

const SENSOR_API = process.env.NEXT_PUBLIC_SENSOR_API_URL

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

  const fetchSensors = async (url: string) => {
    const response = await fetch(url)
    const data = await response.json()

    return data.data
  }

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
      const data = await fetchSensors(`${SENSOR_API}/api/v1/sensors/paginated`)

      setSensors(data)
    }

    fetchData().finally(() => setIsLoading(false))
  }, [])

  const handleResyncData = async () => {
    setIsLoading(true) 

    const fetchData = async () => {
      const data = await fetchSensors(`${SENSOR_API}/api/v1/sensors/paginated`)

      setSensors(data)
    }

    fetchData().finally(() => setIsLoading(false))
  }

  const handlePaginateAction = async (url: string) => {
    setIsLoading(true)

    await fetchSensors(url)
      .then((res: any) => {
        setSensors(res)
      })
      .finally(() => setIsLoading(false))
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