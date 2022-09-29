import React, { useState, useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
//--------------------------//--------------------------------
//--------------------------//--------------------------------
import Copyright from '../components/Copyright';
import axios from 'axios'
import { useNavigate } from "react-router-dom";


const theme = createTheme();

export default function SignIn() {

  /*
  * States
  */
  const [remember, setRemember] = useState(false);
  /*
  * Handlers
  */
  const navigate = useNavigate();
  const handleRemember = (event) => {
    setRemember(event.target.checked);
  };

  const signIn = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    try {
      await axios.post('http://localhost:5000/authapi/auth', {
        username: data.get('username'),
        password: data.get('password'),
        remember: data.get('remember') ? true : false,
        timestamp: new Date()
      })
        .then((response) => {
          let data = response.data
          if (response.status === 200) {
            localStorage.setItem('token', data.token)
            localStorage.setItem('usr', data.username)
            console.log(response)
            navigate("/system");

          } else {
            console.log(response.data)
          }
        })
    } catch (error) {
      console.log(error.response.data);
    }
  }


  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <Box component="form" onSubmit={signIn} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="username"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value={remember} onChange={handleRemember} color="primary" name="remember" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="password-reset" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link href="/signup" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}