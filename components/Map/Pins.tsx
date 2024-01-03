import React, { useEffect, useState } from 'react'
import moment from 'moment'
import L from 'leaflet'
import { 
  Marker,
  Popup
} from "react-leaflet"
import { List, ListItem, ListItemText } from '@mui/material'

interface Props {
  sensor: any
}

const Pins = ({ sensor }: Props) => {
  const [pin, setPin] = useState<string>('pin_rain_green.png')

  useEffect(() => {
    if (sensor.type === 'rain') {
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

    if (sensor.type === 'waterlevel') {
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
  }, [sensor])

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
    >
      <Popup>
        <List>
          <ListItem disablePadding>
            <ListItemText 
              primary={'Sensor Name:'} 
              secondary={sensor.name} 
              sx={{ 
                '&>p': { m: 0 + '!important' }
              }}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText 
              primary={'Sensor Type:'} 
              secondary={sensor.type === 'rain' ? 'Automated Rain Gauge' : 'Water Level Monitoring Sensor'} 
              sx={{ 
                '&>p': { m: 0 + '!important' }
              }}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText 
              primary={'Latitude:'} 
              secondary={sensor.lat} 
              sx={{ 
                '&>p': { m: 0 + '!important' }
              }}
            />
          </ListItem>
          <ListItem disablePadding>
            <ListItemText 
              primary={'Longitude:'} 
              secondary={sensor.long}
              sx={{ 
                '&>p': { m: 0 + '!important' }
              }}
            />
          </ListItem>
          <ListItem disablePadding>
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
    </Marker>
  )
}

export default Pins