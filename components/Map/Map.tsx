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
  isLoading?: boolean,
  isModal?: boolean | undefined
  handleChangeCoordinates?: (coordinates: any) => void | undefined
}

const defaultLat = process.env.NEXT_PUBLIC_DEFAULT_LAT ?? 0
const defaultLong = process.env.NEXT_PUBLIC_DEFAULT_LONG ?? 0

const Map = ({ sensors, isLoading, isModal, handleChangeCoordinates }: Props) => {
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
      center={isModal ? [sensors[0]?.lat ?? defaultLat, sensors[0]?.long ?? defaultLong] : [defaultLat, defaultLong]} 
      zoom={10}
      zoomControl={false}
      style={{ height: isModal ? '20em' : 'calc(100vh - 4.7em)' }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {sensors && sensors?.map((sensor: any, index: any) => 
        <Pins 
          key={sensor?.id ?? index} 
          sensor={sensor} 
          isModal={isModal} 
          handleChangeCoordinates={handleChangeCoordinates}
        />
      )}
    </MapContainer>
  )
}

export default Map