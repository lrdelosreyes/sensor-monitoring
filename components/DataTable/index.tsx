import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material'
import React from 'react'
import Paper from '@mui/material/Paper'
import { deepOrange, grey, orange, red } from '@mui/material/colors';

interface Props {
  data: any,
  handleShowDetails?: (id: string) => void
}

const DataTable = ({ data, handleShowDetails }: Props) => {
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="sensor table">
        <TableHead>
          <TableRow>
            <TableCell align="center">Sensor Name</TableCell>
            <TableCell align="center">Sensor Type</TableCell>
            <TableCell align="center">Latitude</TableCell>
            <TableCell align="center">Longitute</TableCell>
            <TableCell align="center">Current Reading</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data?.map((row: any) => (
            <TableRow
              key={row.id}
              sx={{ 
                cursor: 'pointer',
                '&:hover': {
                  background: deepOrange[200],
                  transition: 'all 0.3s ease-out'
                },
                '&:last-child td, &:last-child th': { border: 0 } 
              }}
            >
              <TableCell 
                onClick={handleShowDetails ? () => handleShowDetails(row.id) : undefined}
                component="th" 
                scope="row" 
                color={grey[800]}
              >
                {row.name}
              </TableCell>
              <TableCell 
                onClick={handleShowDetails ? () => handleShowDetails(row.id) : undefined} 
                color={grey[800]}
              >{row.type === 'rain' ? 'Automated Rain Gauge' : 'Water Level Monitoring System'}
              </TableCell>
              <TableCell 
                onClick={handleShowDetails ? () => handleShowDetails(row.id) : undefined} 
                color={grey[800]}
              >{row.lat}</TableCell>
              <TableCell 
                onClick={handleShowDetails ? () => handleShowDetails(row.id) : undefined} 
                color={grey[800]}
              >{row.long}</TableCell>
              <TableCell 
                onClick={handleShowDetails ? () => handleShowDetails(row.id) : undefined}
                align="right"
                sx={{  
                  color: !!row.reading?.reading_value === false ? red[500] : grey[800]
                }}
              >
                {!!row.reading?.reading_value === false && 'No Data'}
                {row.reading?.reading_value}{row.reading?.unit}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DataTable