import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import EmailSent from '../components/EmailSent';
import axios from 'axios'
const theme = createTheme();

export default function ForgotPassword() {
    const [isSubmitted, setSubmission] = useState(false)
    const [emailSent, setEmailSent] = useState('')


    const sendEmail = async (event) => {
        var usrinfo = undefined
        await passRecovery(event).then((res) => {
            usrinfo = res
        })
        if (usrinfo !== 'error') {
            try {
                await axios.post('http://localhost:5000/authapi/sendemail', {
                    'to': usrinfo['username'],
                    'token': usrinfo['token'],
                    'type': 'recovery',
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



    const passRecovery = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        var usrinfo = undefined
        try {
            await axios.put('http://localhost:5000/authapi/password-recovery', {
                username: data.get('username'),
            })
                .then((response) => {
                    console.log(response.data)
                    console.log(response.status)
                    if (response.status === 201) {
                        console.log("Envia email")
                        setSubmission(true)
                        setEmailSent(response.data.email)
                        usrinfo = response.data
                    }
                })
        } catch (error) {
            console.log(error.response.data)
        }
        if (usrinfo) {
            return usrinfo
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
                                    Reset your password
                                </Typography>
                                <Box component="form" onSubmit={sendEmail} noValidate sx={{ mt: 1 }}>
                                    <TextField
                                        margin="normal"
                                        required
                                        fullWidth
                                        label="Username"
                                        name="username"
                                        autoComplete="email"
                                        autoFocus
                                    />
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        sx={{ mt: 3, mb: 2 }}
                                    >
                                        Password Recovery
                                    </Button>
                                </Box>
                            </Box>
                        </Container>
                    </ThemeProvider>
                )

                : (
                    <EmailSent emailSent={emailSent} />
                )
            }
        </>
    )
}
