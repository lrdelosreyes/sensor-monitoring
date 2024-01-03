import React from 'react'
import Box from '@mui/material/Box'
import Drawer from '@mui/material/Drawer'
import List from '@mui/material/List'
import Divider from '@mui/material/Divider'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import { Typography } from '@mui/material'
import SelectAllIcon from '@mui/icons-material/SelectAll'
import WaterDropIcon from '@mui/icons-material/WaterDrop'
import WaterIcon from '@mui/icons-material/Water'
import { SvgIconComponent } from '@mui/icons-material'
import Image from 'next/image'
import { deepOrange } from '@mui/material/colors'

type SortBy = 'all' | 'rain' | 'waterlevel'

interface Props {
  toggleDrawer: (toggle: boolean) => void
  toggleSort: (sort: SortBy) => void
  isOpenDrawer: boolean
  sortBy: SortBy
}

const drawerMenus: {text: string, value: SortBy, icon: SvgIconComponent}[] = [
  {
    text: 'All Sensors',
    value: 'all',
    icon: SelectAllIcon
  },
  {
    text: 'Automated Rain Gauge',
    value: 'rain',
    icon: WaterDropIcon
  },
  {
    text: 'Water Level Monitoring Sensor',
    value: 'waterlevel',
    icon: WaterIcon
  }
]

const drawerLegends = [
  {
    text: 'No Data',
    icon: '/pin_gray.png'
  },
  {
    text: 'Light',
    icon: '/pin_green.png'
  },
  {
    text: 'Moderate',
    icon: '/pin_orange.png'
  },
  {
    text: 'Torrential',
    icon: '/pin_red.png'
  },
]

const LeftDrawer = ({ 
  toggleDrawer,
  toggleSort, 
  isOpenDrawer,
  sortBy
}: Props) => {
  const list = () => {
    return (
      <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={() => toggleDrawer(false)}
        onKeyDown={() => toggleDrawer(false)}
      >
        <Divider variant='middle' sx={{ mt: 2}} />
        <Box p={2} textAlign='center'>
          <Typography fontWeight={700}>Display</Typography>
        </Box>
        <Divider variant='middle' />
        <List>
          {drawerMenus.map((menu, index) => (
            <ListItem key={menu.text} disablePadding>
              <ListItemButton 
                onClick={() => toggleSort(menu.value)}
                sx={{  
                  background: sortBy === menu.value ? deepOrange[500] : 'unset',
                  color: sortBy === menu.value ? 'white' : 'unset',
                  '&:hover': {
                    background: deepOrange[300],
                    color: 'white'
                  }
                }}
              >
                <ListItemIcon>
                  {<menu.icon sx={{ color: sortBy === menu.value ? 'white' : 'unset' }} />}
                </ListItemIcon>
                <ListItemText primary={menu.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider variant='middle' sx={{ mt: 3 }} />
        <Box p={2} textAlign='center'>
          <Typography fontWeight={700}>Legend</Typography>
        </Box>
        <Divider variant='middle' />
        <List>
          {drawerLegends.map((legend, index) => (
            <ListItem key={legend.text} disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <Image src={legend.icon} width={19} height={27} alt='icon' />
                </ListItemIcon>
                <ListItemText primary={legend.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    )
  }

   return (
    <div>
      <>
        <Drawer
          anchor={'left'}
          open={isOpenDrawer}
          onClose={() => toggleDrawer(false)}
        >
          {list()}
        </Drawer>
      </>
      
    </div>
  )
}

export default LeftDrawer