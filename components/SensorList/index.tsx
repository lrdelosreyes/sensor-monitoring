import React from 'react'
import { Button, Divider, Stack } from '@mui/material'
import SensorCard from './SensorCard'

interface Props {
  data: any,
  handlePaginateAction: (url: string) => void
  handleShowModal: (id: string | null) => void
}

const SensorList = ({ data, handlePaginateAction, handleShowModal }: Props) => {
  return (
    <Stack alignItems='center'>
      <Stack
        flexDirection='row'
        gap={3}
        flexWrap='wrap'
        justifyContent='center'
        sx={{  
          width: '100%'
        }}
      >
        {data.data?.map((sensor: any) => (
          <SensorCard 
            key={sensor.id}
            id={sensor.id}
            name={sensor.name}
            type={sensor.type}
            lat={sensor.lat}
            long={sensor.long}
            handleShowModal={handleShowModal}
          />
        ))}
      </Stack>
      <Divider sx={{ my: 3, width: '100%' }} />
      <Stack flexDirection='row' gap={2}>
        <Button
          size='small'
          onClick={() => handlePaginateAction(data.prev_page_url)} 
          disabled={data.prev_page_url === null}
        >Previous</Button>
        <Divider orientation='vertical' sx={{ height: 'auto' }} />
        <Button 
          size='small'
          onClick={() => handlePaginateAction(data.next_page_url)} 
          disabled={data.next_page_url === null}
        >Next</Button>
      </Stack>
    </Stack>
  )
}

export default SensorList