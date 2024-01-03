'use client'

import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Map from '@/components/Map'
import Navbar from '@/components/Navigation/Navbar'
import LeftDrawer from '@/components/Drawer/LeftDrawer'
import { Box } from '@mui/material'
import Loader from '@/components/Loader'

type SortBy = 'all' | 'rain' | 'waterlevel'

const SENSOR_API = process.env.NEXT_PUBLIC_SENSOR_API_URL

export default function Home() {
  const searchParams = useSearchParams()
  const [sensors, setSensors] = useState<any>([])
  const [sortedSensors, setSortedSensors] = useState<any>([])
  const [isLoading, setLoading] = useState(true)
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [sortBy, setSortBy] = useState<SortBy>('all')
  const [loggedIn, setLoggedIn] = useState(false)

  useEffect(() => {
    const logout = searchParams.get('logout') === '1'

    if (!!logout) handleLogout()
  })

  useEffect(() => {
    if (localStorage.getItem('logged_in') === '1') setLoggedIn(true)
  }, [])

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

  const handleLogin = () => {
    localStorage.setItem('logged_in', '1')
    window.location.href = '/dashboard'
  }

  const handleLogout = () => {
    localStorage.removeItem('logged_in')
    window.location.href = '/'
  }

  return (
    <Suspense fallback={<Loader />}>
      <Box height="100vh">
        <LeftDrawer 
          toggleSort={toggleSort}
          toggleDrawer={toggleDrawer} 
          isOpenDrawer={isOpenDrawer} 
          sortBy={sortBy}
        />
        <Navbar 
          toggleDrawer={toggleDrawer} 
          handleLogin={handleLogin}
          loggedIn={loggedIn} 
        />
        <Map 
          sensors={sortedSensors} 
          isLoading={isLoading} 
        />
      </Box>
    </Suspense>
  )
}
