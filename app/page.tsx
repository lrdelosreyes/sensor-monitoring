'use client'

import { useEffect, useState } from 'react'
import Map from '@/components/Map'
import Navbar from '@/components/Navigation/Navbar'
import LeftDrawer from '@/components/Navigation/LeftDrawer'
import { Box } from '@mui/material'

type SortBy = 'all' | 'rain' | 'waterlevel'

const SENSOR_API = process.env.NEXT_PUBLIC_SENSOR_API_URL

export default function Home() {
  const [sensors, setSensors] = useState<any>([])
  const [sortedSensors, setSortedSensors] = useState<any>([])
  const [isLoading, setLoading] = useState(true)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>('all')

  useEffect(() => {
    setLoading(true)

    const fetchSensors = async () => {
      const response = await fetch(`${SENSOR_API}/api/v1/sensors`)
      const data = await response.json()

      setSensors(data.data)
    }

    fetchSensors().finally(() => {
      setLoading(false)
    })
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

  return (
    <Box height="100vh">
      <LeftDrawer 
        toggleSort={toggleSort}
        toggleDrawer={toggleDrawer} 
        isOpenDrawer={isOpenDrawer} 
      />
      <Navbar toggleDrawer={toggleDrawer} />
      <Map 
        sensors={sortedSensors} 
        isLoading={isLoading} 
      />
    </Box>
  )
}
