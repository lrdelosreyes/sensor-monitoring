import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, TextField } from '@mui/material'
import { blue, grey } from '@mui/material/colors'
import React, { useState } from 'react'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import API from '@/utilities/API'

interface Props {
  isModalOpen: boolean
  handleCloseModal: () => void
  handleLoading: (loading: boolean) => void
  handleFeedback: (feedback: any) => void
}

const LoginModal = ({ 
  isModalOpen, handleCloseModal, handleLoading, handleFeedback
}: Props) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [formData, setFormData] = useState<any>({})
  const [showPassword, setShowPassword] = useState(false)

  const handleClickShowPassword = () => setShowPassword((show) => !show)

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  }

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target
    setFormData({ ...formData, [name]: value })
  }

  const handleLogin = async () => {
    handleLoading(true)

    await API.login(formData)
      .then((res: any) => {
        if (res?.errors) {
          const errors = JSON.parse(JSON.stringify(res?.errors))
          const message = errors.credential ?? errors.password[0]

          handleFeedback({
            status: 'error',
            message
          })
          handleLoading(false)
        }

        if (res?.access_token) {
          localStorage.setItem('access_token', res?.access_token)
          handleCloseModal()
          handleFeedback({
            status: 'success',
            message: 'Login success.'
          })
          window.location.href = '/dashboard'
        }

        handleLoading(false)
      })
      .catch(() =>{
        handleFeedback({
          status: 'error',
          message: 'There was a problem on the login.'
        })
        handleLoading(false)
      })
      .finally(() => {
        handleLoading(false)
        setFormData({})
        setShowPassword(false)
      })
  }
  
  return (
    <Dialog
      fullScreen={fullScreen}
      open={isModalOpen}
    >
      <DialogTitle fontWeight={700}>
        Login
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ background: grey[100] }}>
        <Stack gap={3}> 
          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-username">Username</InputLabel>
            <OutlinedInput
              label="Username"
              id="username"
              name='username'
              onChange={handleChange}
              value={formData?.username ?? ''}
              fullWidth
            />
          </FormControl>

          <FormControl variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
            <OutlinedInput
              label="Password"
              id="password"
              name='password'
              onChange={handleChange}
              value={formData?.password ?? ''}
              fullWidth
              type={showPassword ? 'text' : 'password'}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
        </Stack>  
      </DialogContent>
      <Divider />
      <DialogActions sx={{ mb: 2 }}>
        <Button 
          onClick={() => {
            handleCloseModal()
            setFormData({})
            setShowPassword(false)
          }} 
          autoFocus
          sx={{ color: grey[500], fontWeight: 700 }}
        >
          Close
        </Button>
        <Button 
          onClick={handleLogin} 
          disabled={
            !formData?.username || !formData?.password ? true : false 
          } 
          autoFocus
          sx={{ color: blue[500], fontWeight: 700 }}
        >
          Login
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LoginModal