'use client'

import React from 'react'
import { CircularProgress, Stack } from '@mui/material'
import { 
  MapContainer, 
  TileLayer,
} from "react-leaflet"
import Pins from './Pins'
import 'leaflet/dist/leaflet.css'

interface Props {
  sensors: any, 
  isLoading: boolean
}

const Map = ({ sensors, isLoading }: Props) => {
  if (isLoading) {
    return ( 
      <Stack 
        sx={{ 
          alignItems: 'center',
          height: 'calc(100vh - 4.7em)',
          justifyContent: 'center'
        }}
      >
        <CircularProgress color="inherit" />
      </Stack>
    )
  }
  
  return (
    <MapContainer 
      center={[18.089133286, 121.193151641]} 
      zoom={10}
      zoomControl={false}
      style={{ height: 'calc(100vh - 4.7em)' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sensors.map((sensor: any) => 
        <Pins key={sensor.id} sensor={sensor} />
      )}
    </MapContainer>
  )
}

export default Map