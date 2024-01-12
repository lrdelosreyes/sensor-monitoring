import useMediaQuery from '@mui/material/useMediaQuery'
import { useTheme } from '@mui/material/styles'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, Stack, TextField, Typography } from '@mui/material'
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

interface ContentProps {
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  handleMouseDownPassword: (event: React.MouseEvent<HTMLButtonElement>) => void
  handleClickShowPassword: () => void
  formData: any
  showPassword: boolean
  handleShowRegister?: () => void | undefined
  handleShowLogin?: () => void | undefined
}

const RegisterContent = ({
  handleMouseDownPassword, 
  handleClickShowPassword, 
  handleChange, 
  formData, 
  showPassword,
  handleShowLogin
}: ContentProps) => {
  return (
    <>
      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-username">First Name</InputLabel>
        <OutlinedInput
          label="First Name"
          id="first_name"
          name='first_name'
          onChange={handleChange}
          value={formData?.first_name ?? ''}
          fullWidth
        />
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-username">Middle Name</InputLabel>
        <OutlinedInput
          label="Middle Name"
          id="middle_name"
          name='middle_name'
          onChange={handleChange}
          value={formData?.middle_name ?? ''}
          fullWidth
        />
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-username">Last Name</InputLabel>
        <OutlinedInput
          label="Last Name"
          id="last_name"
          name='last_name'
          onChange={handleChange}
          value={formData?.last_name ?? ''}
          fullWidth
        />
      </FormControl>
      <FormControl variant="outlined">
        <InputLabel htmlFor="outlined-adornment-username">Email</InputLabel>
        <OutlinedInput
          label="Last Email"
          id="email"
          name='email'
          onChange={handleChange}
          value={formData?.email ?? ''}
          fullWidth
        />
      </FormControl>
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

      <Typography variant='body2' textAlign='center'>
        Do you have an existing account?<br/>Login&nbsp;<Button href='#'
          onClick={handleShowLogin}
          sx={{ 
            textTransform: 'none', 
            p: 0,
            minWidth: 'unset' 
          }}
        >here</Button> instead.
      </Typography>
    </>
  )
}

const LoginContent = ({
  handleMouseDownPassword, 
  handleClickShowPassword, 
  handleChange, 
  formData, 
  showPassword,
  handleShowRegister
}: ContentProps) => {
  return (
    <>
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

      <Typography variant='body2' textAlign='center'>
        No account? Sign-up&nbsp;<Button href='#'
          onClick={handleShowRegister}
          sx={{ 
            textTransform: 'none', 
            p: 0,
            minWidth: 'unset' 
          }}
        >here</Button>.
      </Typography>
    </>
  )
}

const LoginModal = ({ 
  isModalOpen, handleCloseModal, handleLoading, handleFeedback
}: Props) => {
  const theme = useTheme()
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const [formData, setFormData] = useState<any>({})
  const [showPassword, setShowPassword] = useState(false)
  const [isLoginState, setIsLoginState] = useState(true)

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

  const handleShowRegister = () => {
    setIsLoginState(false)
  }

  const handleShowLogin = () => {
    setIsLoginState(true)
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

  const handleReigster = async () => {
    handleLoading(true)

    await API.register(formData)
      .then((res: any) => {
        if (res?.errors) {
          const errors = JSON.parse(JSON.stringify(res?.errors))
          let message = ''

          Object.keys(errors).forEach((i: string) => {
            message += errors[i]
          })

          handleFeedback({
            status: 'error',
            message
          })
          handleLoading(false)
        }

        if (res?.data) {
          handleFeedback({
            status: 'success',
            message: 'Account registration complete. Login your account.'
          })
          handleShowLogin()
        }

        handleLoading(false)
      })
      .catch(() =>{
        handleFeedback({
          status: 'error',
          message: 'There was a problem registering your account. Please try again'
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
        {isLoginState ? 'Login' : 'Register'}
      </DialogTitle>
      <Divider />
      <DialogContent sx={{ background: grey[100] }}>
        <Stack gap={3}> 
          {isLoginState ? (
            <LoginContent  
              handleMouseDownPassword={handleMouseDownPassword}
              handleClickShowPassword={handleClickShowPassword}
              handleChange={handleChange}
              formData={formData}
              showPassword={showPassword}
              handleShowRegister={handleShowRegister}
            />
          ) : (
            <RegisterContent  
              handleMouseDownPassword={handleMouseDownPassword}
              handleClickShowPassword={handleClickShowPassword}
              handleChange={handleChange}
              formData={formData}
              showPassword={showPassword}
              handleShowLogin={handleShowLogin}
            />
          )}
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
        {isLoginState ? (
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
        ) : (
          <Button 
            onClick={handleReigster} 
            disabled={
              !formData?.first_name || 
              !formData?.last_name || 
              !formData?.email || 
              !formData?.username || 
              !formData?.password ? 
                true : false 
            } 
            autoFocus
            sx={{ color: blue[500], fontWeight: 700 }}
          >
            Sign-Up
          </Button>
        )}
      </DialogActions>
    </Dialog>
  )
}

export default LoginModal