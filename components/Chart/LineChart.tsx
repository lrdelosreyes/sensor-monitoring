import React, { useEffect, useState } from 'react'
import { ResponsiveLine } from '@nivo/line'
import moment from 'moment'
import { Stack } from '@mui/material'

type Type = 'daily' | 'monthly' | 'yearly'

interface Props {
  type: Type
  data: any,
  lineColor?: string
}

const LineChart = ({ type, data, lineColor }: Props) => {
  const [lineData, setLineData] = useState<any>([])
  const [tickValues, setTickValues] = useState<string>()

  useEffect(() => {
    if (!data) return
    setLineData([{
      id: type,
      color: lineColor ?? 'hsl(274, 70%, 50%)',
      data: data.map((row: any) => {
        let color = 'hsl(346, 70%, 50%)'

        if (type === 'daily') {
          color = 'hsl(43, 70%, 50%)'
        } else if (type === 'monthly') {
          color = 'hsl(346, 70%, 50%)'
        } else if (type === 'yearly') {
          color = 'hsl(273, 70%, 50%)'
        }

        return {
          color,
          x: moment(row.logged_at).format('YYYY-MM-DD HH:mm:ss'),
          y: `${row.reading_value}${row.unit}`,
        }
      })
    }])
  }, [data])

  useEffect(() => {
    switch (type) {
      case 'daily':
        setTickValues('every 4 hours')
        break;
      case 'monthly':
        setTickValues('every 4 days')
        break;
      case 'yearly':
        setTickValues('every 3 months')
        break;
      default:
        setTickValues('every 6 hours')
        break;
    }
  }, [type])

  return (
    <Stack height={300}>
      <ResponsiveLine 
        animate
        data={lineData ?? []}
        xScale={{
          format: '%Y-%m-%d %H:%M:%S',
          precision: 'hour',
          type: 'time',
          useUTC: false
        }}
        xFormat="time:%Y-%m-%d %H:%M:%S"
        yScale={{
          type: 'linear',
          min: 0,
          max: 'auto',
          stacked: false,
          reverse: false,
        }}
        yFormat=" >-,.0d"
        curve="monotoneX"
        axisTop={null}
        axisBottom={{
          format: '%Y-%m-%d %H:%M:%S',
          legendOffset: 0,
          tickValues: tickValues ?? 'every 6 hours'
        }}
        axisRight={null}
        axisLeft={{
          legend: data.unit === 'm' ? 'meters' : 'millimeters',
          legendOffset: 10,
          tickValues: 5,
        }}
        enableGridX={false}
        enableGridY={false}
        enablePoints={false}
        useMesh={true}
        defs={[
          {
            colors: [
              {
                color: 'inherit',
                offset: 0
              },
              {
                color: 'inherit',
                offset: 100,
                opacity: 0
              }
            ],
            id: 'gradientA',
            type: 'linearGradient'
          }
        ]}
        enableArea
        fill={[
          {
            id: 'gradientB',
            match: '*'
          }
        ]}
        margin={{
          bottom: 30,
          left: 60,
          right: 30,
          top: 20
        }}
      />
    </Stack>
  )
}

export default LineChart