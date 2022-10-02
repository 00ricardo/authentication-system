import React, { useState, useEffect } from 'react';
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
import EmailSent from '../components/EmailSent';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import checkFormInputs from '../utils/validation'
//--------------------------//--------------------------------
//--------------------------//--------------------------------
import Copyright from '../components/Copyright';
import axios from 'axios'

const theme = createTheme();


export default function SignUp() {



    /*
    * States
    */
    const [isSubmitted, setSubmission] = useState(false)
    const [emailSent, setEmailSent] = useState('')
    const [errors, setErrors] = useState([])
    /*

   /*
    * Effects
    */
    useEffect(() => {

        console.log(`Is Loading: ${isSubmitted}`);
        console.log(errors)
    }, [isSubmitted, errors]);


    /* 
    *Handlers
    */

    const sendEmail = async (event) => {
        var usrt = undefined
        await registerUser(event).then((res) => {
            usrt = res
        })

        const data = new FormData(event.target);
        if (usrt !== 'error') {
            try {
                await axios.post('http://localhost:5000/authapi/sendemail', {
                    'to': data.get('email'),
                    'token': usrt,
                    'type': 'confirmation',
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                })
                    .then((response) => {
                        console.log(response.data)
                        console.log(response.status)
                    })
            } catch (error) {
                console.log(error);
            }
        }


    }

    const registerUser = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        const rp = ['firstName', 'lastName', 'email', 'password']
        var required = checkFormInputs(rp, data)

        if (required.length !== 0) {
            setErrors(required['missing'])
        }

        if (required['message'] === 'valid') {
            var usrt = undefined
            try {
                await axios.post('http://localhost:5000/authapi/register', {
                    first_name: data.get('firstName'),
                    last_name: data.get('lastName'),
                    email: data.get('email'),
                    password: data.get('password'),
                    headers: {
                        "Access-Control-Allow-Origin": '*'
                    }
                })
                    .then((response) => {
                        if (response.status === 201) {
                            setSubmission(current => !current)
                            setEmailSent(response.data.email)
                            usrt = response.data.token
                        }

                    })
            } catch (error) {
                if (error.response.status === 400) {
                    console.log(error.response.data);
                }
                console.log(error)
            }
            return usrt;
        } else {
            return 'error'
        }
    };

    return (
        <>
            {!isSubmitted ?
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
                                                error={errors && errors.includes('firstName') ? true : false}
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
                                                error={errors && errors.includes('lastName') ? true : false}
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
                                                error={errors && errors.includes('email') ? true : false}
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
                                                error={errors && errors.includes('password') ? true : false}
                                                helperText={errors && errors.includes('password') ? 'Password Required' : ''}
                                                variant="standard"
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
                    <EmailSent emailSent={emailSent} />
                )
            }
        </>
    );
}