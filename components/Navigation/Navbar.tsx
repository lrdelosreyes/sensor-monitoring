import React from 'react'
import { Box, Stack, Toolbar, Button, AppBar, Avatar } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { deepOrange } from '@mui/material/colors'

interface Props {
  toggleDrawer: (toggle: boolean) => void,
  handleLogin?: () => void | undefined
  loggedIn: boolean
}

const Navbar = ({ toggleDrawer, handleLogin, loggedIn }: Props) => {
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
          <Box>
            <Button 
              color="inherit" href='/'
              sx={{ 
                display: { xs: 'none', sm: 'block' } 
              }}
            >Sensor Monitoring</Button>
          </Box>
          <Box sx={{ flexGrow: 1 }}></Box>
          <Button 
            color="inherit" 
            href={loggedIn ? '/dashboard' : '#'}
            onClick={handleLogin}
          >
            {loggedIn ? (
              <Stack>
                <Avatar 
                  sx={{ 
                    bgcolor: deepOrange[700], 
                    width: 36, 
                    height: 36,
                    fontSize: '1rem'
                  }}
                >JD</Avatar>
              </Stack>
            ) : 'Login'}
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  )
}

export default Navbar