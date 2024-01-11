import React, { useEffect, useState } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Divider, MenuItem, Stack, TextField } from '@mui/material'
import { deepOrange, red, blue, grey, green } from '@mui/material/colors'
import Map from '../Map'
import API from '@/utilities/API'

interface Props {
  sensorData: any
  isModalOpen: boolean
  handleCloseModal: () => void
  handleLoading: (loading: boolean) => void
  handleResyncData: () => void
  handleFeedback: (feedback: any) => void
}

const sensorTypes = [
  {
    value: 'rain',
    label: 'Automated Rain Gauge',
  },
  {
    value: 'waterlevel',
    label: 'Water Level Monitoring System',
  }
]

const defaultLat = process.env.NEXT_PUBLIC_DEFAULT_LAT ?? 0
const defaultLong = process.env.NEXT_PUBLIC_DEFAULT_LONG ?? 0

const CreateUpdateModal = ({ 
  sensorData, isModalOpen, handleCloseModal, handleLoading, handleResyncData, handleFeedback
}: Props) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [formData, setFormData] = useState<any>({})
  const [coordinates, setCoordinates] = useState<any>({})

  useEffect(() => {
    if (sensorData === null) return 
    setFormData(sensorData)
  }, [sensorData])

  useEffect(() => {
    if (!formData?.lat && !formData?.long) {
      setFormData({ 
        ...formData, lat: defaultLat, long: defaultLong
      })
    }
  }, [formData])

  useEffect(() => {
     setFormData({ 
      ...formData, 
      lat: coordinates.lat ,
      long: coordinates.long
    })
  }, [coordinates])

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleCreate = async () => {
    handleLoading(true)

    await API.createSensor(formData)
      .then((res: any) => {
        console.log(res?.data)
      })
      .catch(() =>{
        handleFeedback({
          status: 'error',
          message: 'There was a problem adding the sensor.'
        })
        handleLoading(false)
      })
      .finally(() => {
        handleFeedback({
          status: 'success',
          message: 'The sensor was added successfully.'
        })
        handleLoading(false)
        handleCloseModal()
        handleResyncData()
      })
  }

  const handleUpdate = async () => {
    handleLoading(true)

    await API.updateSensor(sensorData.id, formData)
      .then((res: any) => {
        console.log(res?.data)
      })
      .catch(() =>{
        handleFeedback({
          status: 'error',
          message: 'There was a problem updating the sensor.'
        })
        handleLoading(false)
      })
      .finally(() => {
        handleFeedback({
          status: 'success',
          message: 'The sensor details have been successfully updated.'
        })
        handleLoading(false)
        handleCloseModal()
        handleResyncData()
      })
  }

  const handleDelete = async () => {
    handleLoading(true)

    await API.deleteSensor(sensorData.id)
      .then((res: any) => {
        console.log(res?.data)
      })
      .catch(() =>{
        handleFeedback({
          status: 'error',
          message: 'There was a problem deleting the sensor.'
        })
        handleLoading(false)
      })
      .finally(() => {
        handleFeedback({
          status: 'success',
          message: 'The sensor has been successfully deleted.'
        })
        handleLoading(false)
        handleCloseModal()
        handleResyncData()
      })
  }

  const handleChangeCoordinates = (latLng: any) => {
    setCoordinates({
      ...coordinates,
      lat: latLng.lat,
      long: latLng.lng
    })
  }

  return (
    <Dialog
      fullScreen={fullScreen}
      open={isModalOpen}
    >
      <DialogTitle fontWeight={700}>
        {sensorData !== null ? `Sensor (ID: ${sensorData.id})` : 'Create Sensor'}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ width: { xs: 'initial', sm: 500} }}>
        <Stack gap={3}>  
          <TextField
            label="Sensor Name"
            id="name"
            name='name'
            onChange={handleChange}
            value={formData?.name ?? ''}
            fullWidth
            focused
          />

          <TextField
            id="type"
            name='type'
            select
            label="Select Sensor Type"
            helperText="Please select sensor type"
            onChange={handleChange}
            value={formData?.type ?? ''}
            fullWidth
            focused
          >
            {sensorTypes.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>

          <Stack flexDirection='row' gap={3}>
            <TextField
              label="Latitude"
              id="lat"
              name='lat'
              onChange={handleChange}
              value={formData?.lat ?? defaultLat}
              fullWidth
              focused
            />
            <TextField
              label="Longitude"
              id="long"
              name='long'
              onChange={handleChange}
              value={formData?.long ?? defaultLong}
              fullWidth
              focused
            />
          </Stack>

          <Map 
            sensors={[formData ?? {lat: defaultLat, long: defaultLong}]} 
            isLoading={false} 
            isModal={true} 
            handleChangeCoordinates={handleChangeCoordinates}
          />
        </Stack>  
      </DialogContent>
      <Divider />
      <DialogActions sx={{ mb: 2 }}>
        <Button 
          onClick={() => {
            setFormData(null)
            handleFeedback(undefined)
            handleCloseModal()
          }} 
          autoFocus
          sx={{ color: grey[500], fontWeight: 700 }}
        >
          Cancel
        </Button>
        {sensorData !== null && (
          <Button 
            onClick={handleDelete} 
            autoFocus
            sx={{ color: red[500], fontWeight: 700 }}
          >
            Delete
          </Button>
        )}
        <Button 
          onClick={
            !formData?.name || !formData?.type || !formData?.lat || !formData?.long ?
              undefined :
              (sensorData !== null ? handleUpdate : handleCreate)
          }
          disabled={
            !formData?.name || !formData?.type || !formData?.lat || !formData?.long ? true : false 
          } 
          autoFocus
          sx={{ 
            color: sensorData !== null ? deepOrange[500] : blue[500], 
            fontWeight: 700 
          }}
        >
          {sensorData !== null ? 'Update' : 'Create'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default CreateUpdateModal