import React, { useEffect } from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'
import { Divider, Stack, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'
import LineChart from '../Chart/LineChart'

interface Props {
  sensorData: any
  isModalOpen: boolean
  handleCloseModal: () => void
}

const DetailsModal = ({ 
  sensorData, isModalOpen, handleCloseModal
}: Props) => {

  useEffect(() => {
    console.log(sensorData)
  }, [sensorData])

  return (
    <Dialog
      fullScreen={true}
      open={isModalOpen}
    >
      <DialogTitle fontWeight={700}>
        {`Sensor Details (ID: ${sensorData?.id ?? '0'})`}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ background: grey[100] }}>
        <Stack gap={10}> 
          <Stack gap={1}>
            <Typography variant='h6'>Daily</Typography>
            <Divider />
            <LineChart 
              type='daily'
              data={sensorData?.daily_readings ?? []} 
              lineColor='hsl(274, 70%, 50%)'
              readingUnit={sensorData?.type === 'rain' ? 'millimeters' : 'meters'}
            />
          </Stack>

          <Stack gap={1}>
            <Typography variant='h6'>Monthly</Typography>
            <Divider />
            <LineChart 
              type='monthly'
              data={sensorData?.monthly_readings ?? []} 
              lineColor='hsl(148, 70%, 50%)'
              readingUnit={sensorData?.type === 'rain' ? 'millimeters' : 'meters'}
            />
          </Stack>

          <Stack gap={1}>
            <Typography variant='h6'>Yearly</Typography>
            <Divider />
            <LineChart 
              type='yearly'
              data={sensorData?.yearly_readings ?? []} 
              lineColor='hsl(317, 70%, 50%)'
              readingUnit={sensorData?.type === 'rain' ? 'millimeters' : 'meters'}
            />
          </Stack>
        </Stack>  
      </DialogContent>
      <Divider />
      <DialogActions sx={{ mb: 2 }}>
        <Button 
          onClick={handleCloseModal} 
          autoFocus
          sx={{ color: grey[500], fontWeight: 700 }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DetailsModal