import React from 'react'
import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'

interface Props {
  toggleDrawer: (toggle: boolean) => void
}

const Navbar = ({ toggleDrawer }: Props) => {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar sx={{ minHeight: '3.5em !important' }}>
          <IconButton
            size="small"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => toggleDrawer(true)}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }}>
            <Button 
              color="inherit" href='/'
              sx={{ 
                display: { xs: 'none', sm: 'block' } 
              }}
            >Sensor Monitoring</Button>
          </Box>
          <Button color="inherit" href='/dashboard'>Dashboard</Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar