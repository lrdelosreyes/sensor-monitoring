import React from 'react'
import { Button, Card, CardActions, CardContent, Typography } from '@mui/material'

interface Props {
  title: string
  value: string | number
  backgroundColor?: string,
  color?: string
}

const DashboardCard = ({ title, value, backgroundColor, color }: Props) => {
  return (
    <Card sx={{ flex: 1, backgroundColor, color }}>
      <CardContent>
        <Typography variant="body1" component="div" mb={1}>
          {title}
        </Typography>
        <Typography variant="h3" textAlign='right' component="div" pr={3}>
          {value}
        </Typography>
      </CardContent>
      <CardActions sx={{ justifyContent: 'end', pr: 3 }}>
        <Button 
          href='/'
          size="small" 
          sx={{ textTransform: 'none', color }}
        >
          Learn More
        </Button>
      </CardActions>
    </Card>
  )
}

export default DashboardCard