import React, { useEffect, useMemo, useRef, useState } from 'react'
import moment from 'moment'
import L from 'leaflet'
import { 
  Marker,
  Popup
} from "react-leaflet"
import { List, ListItem, ListItemText } from '@mui/material'

interface Props {
  sensor: any
  isModal?: boolean | undefined
  handleChangeCoordinates?: (coordinates: any) => void | undefined
}

const Pins = ({ sensor, isModal, handleChangeCoordinates }: Props) => {
  const [pin, setPin] = useState<string>('pin_rain_green.png')
  const markerRef = useRef<any>(null)
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current
        if (marker != null) {
          handleChangeCoordinates && 
            handleChangeCoordinates(marker.getLatLng() ?? {lat: 0, lang: 0})
        }
      },
    }),
    [],
  )

  useEffect(() => {
    if (!sensor) return
    if (isModal) setPin('/pin_gray.png')
    if (sensor.type === 'rain' && !isModal) {
      if (!sensor.reading) {
        setPin('/pin_rain_gray.png')
        return
      }

      if (sensor.reading.reading_value >= 0 && sensor.reading.reading_value <= 60) {
        setPin('/pin_rain_green.png')
      } else if (sensor.reading.reading_value >=61 && sensor.reading.reading_value <=120) {
        setPin('/pin_rain_orange.png')
      } else if (sensor.reading.reading_value >=121) {
        setPin('/pin_rain_red.png')
      }
    }

    if (sensor.type === 'waterlevel' && !isModal) {
      if (!sensor.reading) {
        setPin('/pin_water_gray.png')
        return
      }

      if (sensor.reading.reading_value >= 0 && sensor.reading.reading_value <= 30) {
        setPin('/pin_water_green.png')
      } else if (sensor.reading.reading_value >=31 && sensor.reading.reading_value <=60) {
        setPin('/pin_water_orange.png')
      } else if (sensor.reading.reading_value >=61) {
        setPin('/pin_water_red.png')
      }
    }
  }, [sensor, isModal])

  if (!sensor) return <></>

  return (
    <Marker 
      key={sensor.id} 
      position={[sensor.lat, sensor.long]}
      icon={
        new L.Icon({
          iconUrl: pin,
          iconRetinaUrl: pin,
          iconSize: [18, 30],
          iconAnchor: [9, 30],
          popupAnchor: [0, -30],
        })
      }
      draggable={isModal}
      eventHandlers={eventHandlers}
      ref={markerRef}
    >
      {!isModal && (
        <Popup>
          <List>
            <ListItem key='name' disablePadding>
              <ListItemText 
                primary={'Sensor Name:'} 
                secondary={sensor.name} 
                sx={{ 
                  '&>p': { m: 0 + '!important' }
                }}
              />
            </ListItem>
            <ListItem key='type' disablePadding>
              <ListItemText 
                primary={'Sensor Type:'} 
                secondary={sensor.type === 'rain' ? 'Automated Rain Gauge' : 'Water Level Monitoring Sensor'} 
                sx={{ 
                  '&>p': { m: 0 + '!important' }
                }}
              />
            </ListItem>
            <ListItem key='lat' disablePadding>
              <ListItemText 
                primary={'Latitude:'} 
                secondary={sensor.lat} 
                sx={{ 
                  '&>p': { m: 0 + '!important' }
                }}
              />
            </ListItem>
            <ListItem key='long' disablePadding>
              <ListItemText 
                primary={'Longitude:'} 
                secondary={sensor.long}
                sx={{ 
                  '&>p': { m: 0 + '!important' }
                }}
              />
            </ListItem>
            <ListItem key='value' disablePadding>
              <ListItemText 
                primary={'Recent Value:'} 
                secondary={
                  sensor.reading ? 
                  `${sensor.reading?.reading_value}${sensor.reading?.unit} (${
                    moment(sensor.reading?.logged_at).format('lll')
                  })` : 
                  'No Data'
                } 
                sx={{ 
                  '&>p': { m: 0 + '!important' }
                }}
              />
            </ListItem>
          </List>
        </Popup>
      )}
    </Marker>
  )
}

export default Pins