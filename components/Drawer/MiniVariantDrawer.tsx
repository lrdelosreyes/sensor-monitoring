'use client'

import React, { Suspense, useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import useMediaQuery from '@mui/material/useMediaQuery'
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles'
import Box from '@mui/material/Box'
import MuiDrawer from '@mui/material/Drawer'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import { Button, Stack } from '@mui/material'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import ChevronRightIcon from '@mui/icons-material/ChevronRight'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import DashboardIcon from '@mui/icons-material/Dashboard'
import SensorsIcon from '@mui/icons-material/Sensors'
import PublicIcon from '@mui/icons-material/Public'
import LogoutIcon from '@mui/icons-material/Logout'
import { SvgIconComponent } from '@mui/icons-material'
import Link from 'next/link'
import { deepOrange, grey } from '@mui/material/colors'

interface Props {
  children: React.ReactNode
  firstName?: string
  lastName?: string
  loggedIn: boolean
  isAdmin?: boolean
  handleLoading?: (isLoading: boolean) => void
}

const drawerWidth = 240;
const drawerMenus1: {text: string, href: string, roles: string, icon: SvgIconComponent}[] = [
  {
    text: 'Dashboard',
    href: '/dashboard',
    roles: 'admin,user',
    icon: DashboardIcon
  },
  {
    text: 'Sensors',
    href: '/sensors',
    roles: 'admin',
    icon: SensorsIcon
  }
]

const drawerMenus2: {text: string, href: string, icon: SvgIconComponent}[] = [
  {
    text: 'Home',
    href: '/',
    icon: PublicIcon
  },
  {
    text: 'Logout',
    href: '/?logout=1',
    icon: LogoutIcon
  }
]

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);

const MiniVariantDrawer = ({ 
  children, firstName, lastName, loggedIn, isAdmin, handleLoading
 }: Props) => {
  const pathname = usePathname()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'))
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (isMobile) {
      handleDrawerClose()
    } else {
      handleDrawerOpen()
    }
  }, [isMobile])

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" open={open}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ flexGrow: 1 }} />
          <Box>
            <Link href='/dashboard'>
              <Button 
                color="inherit"
                sx={{ 
                  display: { xs: 'none', sm: 'block' } 
                }}
              >Welcome, {firstName} {lastName}!</Button>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {drawerMenus1.map((menu, index) => {
            const roles = menu.roles.split(',')
            const role = isAdmin ? 'admin' : 'user'

            return (
              <ListItem key={menu.text} disablePadding sx={{ display: 'block' }}>
                <Link 
                  href={roles.includes(role) ? menu.href : '#'} 
                  onClick={() => {
                    if (!roles.includes(role)) alert('User has no permission.')
                    if (roles.includes(role)) handleLoading && handleLoading(true)
                  }}
                >
                  <ListItemButton
                    sx={{
                      minHeight: 48,
                      justifyContent: open ? 'initial' : 'center',
                      px: 2.5,
                      background: pathname === menu.href ? deepOrange[500] : 'unset',
                      color: pathname === menu.href ? 'white' : 'unset',
                      '&:hover': {
                        background: deepOrange[300],
                        color: 'white'
                      }
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: open ? 3 : 'auto',
                        justifyContent: 'center',
                      }}
                    >
                      {<menu.icon sx={{ color: pathname === menu.href ? 'white' : 'unset' }} />}
                    </ListItemIcon>
                    <ListItemText primary={menu.text} sx={{ opacity: open ? 1 : 0 }} />
                  </ListItemButton>
                </Link>
              </ListItem>
            )
          })}
        </List>
        <Divider />
        <List>
          {drawerMenus2.map((menu, index) => (
            <ListItem key={menu.text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                href={menu.href}
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                  '&:hover': {
                    background: deepOrange[300],
                    color: 'white'
                  }
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {<menu.icon />}
                </ListItemIcon>
                <ListItemText primary={menu.text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          background: grey[200],
          color: grey[800],
          height: '100vh',
          overflowY: 'auto'
        }}
      >
        <DrawerHeader />
        {loggedIn && (
          <Suspense>
            <Stack>{children}</Stack>
          </Suspense>
        )}
      </Box>
    </Box>
  );
}

export default MiniVariantDrawer