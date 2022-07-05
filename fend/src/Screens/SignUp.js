import { useState, useEffect, Fragment } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import CardMedia from '@mui/material/CardMedia';
import Alert from '@mui/material/Alert';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import mailSent from '../img/mail_sent.png'
//--------------------------//--------------------------------
//--------------------------//--------------------------------
import Copyright from '../Components/Copyright';
import axios from 'axios'

const theme = createTheme();


export default function SignUp() {



    /*
    * States
    */
    const [isLoading, setLoading] = useState(false)
    const [emailSent, setEmailSent] = useState('')
    /*

   /*
    * Effects
    */
    useEffect(() => {
        console.log(isLoading);
    }, [isLoading]);


    /* 
    *Handlers
    */

    const sendEmail = async (event) => {
        await registerUser(event)
        console.log(process.env.REACT_APP_EMAIL_TOKEN)
        try {
            await axios.post('http://localhost:3001/authapi/sendemail', {
                'from': "aa",
                'to': "bb",
                'subject': "cc",
                'body': "dd",
                'token': "dadkmasfashdbfnsidbfnuasoumfihq028934y7risf"
            })
                .then((response) => {
                    console.log(response.data)
                    console.log(response.status)
                })
        } catch (error) {
            console.log(error.response.data);
        }

    }

    const registerUser = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            await axios.post('http://localhost:3001/authapi/register', {
                first_name: data.get('firstName'),
                last_name: data.get('lastName'),
                email: data.get('email'),
                password: data.get('password'),
            })
                .then((response) => {
                    console.log(response.data)
                    console.log(response.status)
                    if (response.status === 201) {
                        setLoading(current => !current)
                        setEmailSent(response.data.email)
                    }
                })
        } catch (error) {
            console.log(error.response.data);
        }
    };

    return (
        <>
            {!isLoading ?
                (
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
                                    Sign up
                                </Typography>
                                <Box component="form" noValidate onSubmit={sendEmail} sx={{ mt: 3 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                autoComplete="given-name"
                                                name="firstName"
                                                required
                                                fullWidth
                                                id="firstName"
                                                label="First Name"
                                                autoFocus
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={6}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="lastName"
                                                label="Last Name"
                                                name="lastName"
                                                autoComplete="family-name"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                id="email"
                                                label="Email Address"
                                                name="email"
                                                autoComplete="email"
                                            />
                                        </Grid>
                                        <Grid item xs={12}>
                                            <TextField
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password"
                                                type="password"
                                                id="password"
                                                autoComplete="new-password"
                                            />
                                        </Grid>
                                    </Grid>
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Sign Up
                                    </Button>
                                    <Grid container justifyContent="flex-end">
                                        <Grid item>
                                            <Link href="/" variant="body2">
                                                Already have an account? Sign in
                                            </Link>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                            <Copyright sx={{ mt: 5 }} />
                        </Container>
                    </ThemeProvider>
                )

                : (
                    <Fragment>
                        <CssBaseline />
                        <Container maxWidth="sm">
                            <Box sx={{ height: '100vh' }}>
                                <CardMedia
                                    component="img"
                                    image={mailSent}
                                    alt="Email Sent"
                                />
                                <h1 style={{ textAlign: 'center' }}>Email Confirmation</h1>
                                <Alert severity="success"> We have sent a email to <a style={{ color: "green" }}>{emailSent}</a> to confirm the validity of your email address. After receiving the email follow the link provided to complete your registration.</Alert>
                                <Divider variant="middle" />
                                <div style={{ textAlign: 'center' }} >
                                    If you not receive any email <a href='#'> Resend confirmation email </a>.
                                </div>
                            </Box>
                        </Container>
                    </Fragment>
                )
            }
        </>
    );
}