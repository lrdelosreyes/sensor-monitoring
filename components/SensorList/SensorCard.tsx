import React from 'react'
import { Card, CardActionArea, CardContent, Typography } from '@mui/material'
import { grey } from '@mui/material/colors'

interface Props {
  id: string,
  name: string,
  type: string,
  lat: number | string,
  long: number | string,
  handleShowModal: (id: string | null) => void
}

const SensorCard = ({
  id, name, type, lat, long, handleShowModal
}: Props) => {
  return (
    <Card 
      sx={{ 
        minWidth: { xs: 150, sm: 275}, 
        width: 275,
        backgroundColor: grey[900],
        backgroundImage: `url(${type === 'rain' ? '/drop_white.png' : '/water_white.png'})`,
        backgroundPosition: type === 'rain' ? '12em 0.4em' : '12em -1.5em',
        backgroundRepeat: 'no-repeat',
        backgroundSize: type === 'rain' ? '5em' : '9em',
        backgroundBlendMode: 'overlay',
        color: grey[50] 
      }}
    >
      <CardActionArea onClick={() => handleShowModal(id)}>
        <CardContent>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography sx={{ mt: 0.5, mb: 2 }} color={grey[500]}>
            {type === 'rain' ? 'Automated Rain Gauge' : 'Water Level Monitoring System'}
          </Typography>
          <Typography variant="body2">
            {lat}, {long}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  )
}

export default SensorCard