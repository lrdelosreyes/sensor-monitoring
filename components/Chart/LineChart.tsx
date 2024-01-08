import React, { useEffect, useState } from 'react'
import { PointTooltipProps, ResponsiveLine, SliceTooltipProps } from '@nivo/line'
import { TIME_PRECISION } from '@nivo/scales/dist/types/timeHelpers'
import moment from 'moment'
import { Badge, Box, Chip, Stack, Typography } from '@mui/material'

type Type = 'daily' | 'monthly' | 'yearly'

interface Props {
  type: Type
  data: any,
  readingUnit: string,
  xFormat?: string,
  lineColor?: string
}

const LineChart = ({ 
    type, 
    data, 
    readingUnit, 
    xFormat,
    lineColor 
  }: Props) => {
  const [lineData, setLineData] = useState<any>([])
  const [tickValues, setTickValues] = useState<string>()
  const [precision, setPrecision] = useState<TIME_PRECISION>()

  useEffect(() => {
    if (!data) return
    setLineData([
      {
        id: 'Max',
        color: lineColor ?? 'hsl(274, 70%, 50%)',
        data: data?.max?.map((row: any) => {
          let dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'

          if (type === 'daily') {
            dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
          } else if (type === 'monthly') {
            dateTimeFormat = 'YYYY-MM-DD'
          } else if (type === 'yearly') {
            dateTimeFormat = 'YYYY-MM'
          }

          return {
            x: moment(row.logged_at).format(dateTimeFormat),
            y: `${row.reading_value}${row.unit}`,
          }
        })
      },
      {
        id: 'Min',
        data: data?.min?.map((row: any) => {
          let dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'

          if (type === 'daily') {
            dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
          } else if (type === 'monthly') {
            dateTimeFormat = 'YYYY-MM-DD'
          } else if (type === 'yearly') {
            dateTimeFormat = 'YYYY-MM'
          }

          return {
            x: moment(row.logged_at).format(dateTimeFormat),
            y: `${row.reading_value}${row.unit}`,
          }
        })
      },
      {
        id: 'Avg',
        color: lineColor ?? 'hsl(274, 70%, 50%)',
        data: data?.avg?.map((row: any) => {
          let dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'

          if (type === 'daily') {
            dateTimeFormat = 'YYYY-MM-DD HH:mm:ss'
          } else if (type === 'monthly') {
            dateTimeFormat = 'YYYY-MM-DD'
          } else if (type === 'yearly') {
            dateTimeFormat = 'YYYY-MM'
          }

          return {
            x: moment(row.logged_at).format(dateTimeFormat),
            y: `${row.reading_value}${row.unit}`,
          }
        })
      }
    ])
  }, [data])

  useEffect(() => {
    switch (type) {
      case 'daily':
        setTickValues('every 6 hours')
        setPrecision('hour')
        break;
      case 'monthly':
        setTickValues('every 4 days')
        setPrecision('day')
        break;
      case 'yearly':
        setTickValues('every 3 months')
        setPrecision('month')
        break;
      default:
        setTickValues('every 4 hours')
        setPrecision('hour')
        break;
    }
  }, [type])

  const CustomSliceTooltip = ({ slice, axis }: SliceTooltipProps) => {
    return (
      <Box
        sx={(theme) => ({
          background: 'white',
          padding: '1em',
          borderRadius: '3px',
          boxShadow: '0px 10px 15px -3px rgba(0,0,0,0.1)',
          textAlign: 'center',
        })}
      >
        <Typography
          variant="subtitle2"
          color="#7c8db5"
          pb={1}
        >
          {type === 'daily' && moment(slice.points[0].data.xFormatted).format('LLL')}
          {type === 'monthly' && moment(slice.points[0].data.xFormatted).format('dddd, MMM D, YYYY')}
          {type === 'yearly' && moment(slice.points[0].data.xFormatted).format('MMMM, YYYY')}
        </Typography>
        {slice.points.map((point, index) => (
          <div key={`point-${index}`}>
            <Stack
              flexDirection='row'
              justifyContent='space-between'
            >
              <Box 
                sx={{ 
                  background: point.serieColor, 
                  width: 20, 
                  height: 20,
                  borderRadius: '3em' 
                }}></Box>
              <Typography flex={1} textAlign='start' pl={2}>
                {point.serieId}:
              </Typography>
              <Typography fontWeight={'bold'} textAlign='end' pl={2}>
                {point.data.yFormatted}{readingUnit === 'meters' ? 'm' : 'mm'}
              </Typography>
            </Stack>
          </div>
        ))}
      </Box>
    )
  }

  return (
    <Stack height={300}>
      <ResponsiveLine 
        animate
        data={lineData ?? []}
        sliceTooltip={({ slice, axis }) => (
          <CustomSliceTooltip slice={slice} axis={axis} />
        )}
        xScale={{
          format: xFormat ?? '%Y-%m-%d %H:%M:%S',
          precision,
          type: 'time',
          useUTC: false
        }}
        xFormat={`time:${xFormat ?? '%Y-%m-%d %H:%M:%S'}`}
        yScale={{
          type: 'linear',
          min: 0,
          max: 'auto',
          stacked: false,
          reverse: false
        }}
        yFormat='>-,.2f'
        curve="monotoneX"
        axisTop={null}
        axisBottom={{
          format: xFormat ?? '%Y-%m-%d %H:%M:%S',
          legendOffset: 0,
          tickValues: tickValues ?? 'every 6 hours',
          
        }}
        axisRight={null}
        axisLeft={{
          legend: readingUnit ?? 'millimeters',
          legendOffset: 10,
          tickValues: 5,
        }}
        enableGridX={false}
        enableGridY={false}
        enablePoints={true}
        enableSlices='x'
        useMesh={true}
        colors={{ 
        'scheme': 'set1'
        }}
        enableArea
        margin={{
          bottom: 30,
          left: 35,
          right: 10,
          top: 20
        }}
        pointBorderColor={{ from: 'serieColor' }}
      />
    </Stack>
  )
}

export default LineChart