import React from 'react'
import DashboardCard from './DashboardCard'
import { Stack } from '@mui/material'
import { grey, red, green, blue } from '@mui/material/colors'

interface Props {
  sensorStats: {
    total: number
    total_working: number
    total_down: number
  } | undefined
}

const DashboardCards = ({ sensorStats }: Props) => {
  return (
    <Stack 
      flexDirection={{ xs: 'column', md: 'row' }}
      justifyContent='space-between'
      flexWrap='wrap'
      gap={{ xs: 3, lg: 10 }}
    >
      <DashboardCard 
        title='Total Sensors'
        value={sensorStats?.total ?? 0}
        backgroundColor={blue[500]}
        color={grey[100]}
      />
      <DashboardCard 
        title='Total Working Sensor'
        value={sensorStats?.total_working ?? 0}
        backgroundColor={green[500]}
        color={grey[100]}
      />
      <DashboardCard 
        title='Total Down Sensor'
        value={sensorStats?.total_down ?? 0}
        backgroundColor={red[500]}
        color={grey[100]}
      />
    </Stack>
    
  )
}

export default DashboardCards