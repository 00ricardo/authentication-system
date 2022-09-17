import React, { useEffect, useState, Fragment } from 'react'
import axios from 'axios'

import logo from '../img/logo.jpg'
import Divider from '@mui/material/Divider';
import CardMedia from '@mui/material/CardMedia';
import Alert from '@mui/material/Alert';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
export default function ConfirmEmail() {

    const [verified, setVerified] = useState(false)
    const [type, setType] = useState(undefined)
    const [username, setUsername] = useState('')
    const [token, setToken] = useState('')
    const [passchanged, setPassChanged] = useState(false)

    const verifyToken = async () => {
        let params = new URL(document.location).searchParams;
        setType(params.get('type'))
        try {
            await axios.put('http://localhost:5000/authapi/confirm-email', {
                token: params.get('token'),
                type: params.get('type'),
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                }
            })
                .then((response) => {
                    console.log(response.data)
                    console.log(response.status)
                    if (response.status === 200) {
                        if (response.data.data.confirmation) {
                            setVerified(false)
                        }
                        if (response.data.data.username) {
                            setUsername(response.data.data.username)
                            setToken(response.data.data.token)
                        }
                    }
                })
        } catch (error) {
            console.log(error.response.data)
            setVerified(true)
        }
    }


    const recovery = async (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        try {
            await axios.put('http://localhost:5000/authapi/change-password', {
                username: username,
                opass: data.get('original-password'),
                cpass: data.get('clone-password'),
                token: token,
                type: 'recovery',
                headers: {
                    'Content-Type': "application/json",
                    'Accept': "application/json",
                }
            })
                .then((response) => {
                    console.log(response.data)
                    console.log(response.status)
                    if (response.status === 200) {
                        if (response.data.confirmation) {
                            setVerified(false)
                        }
                        if (response.data.type === 'recovery') {
                            setPassChanged(true)
                        }
                    }
                })
        } catch (error) {
            console.log(error.response.data)
        }
    }

    useEffect(() => {
        verifyToken()
    }, [username, token])
    return (
        <Fragment>
            <CssBaseline />
            {verified ?
                <Container maxWidth="sm">
                    <Box sx={{ height: '100vh' }}>
                        <CardMedia
                            component="img"
                            image={logo}
                            alt="Ricardo Briceño's Authentication System"
                        />
                        {type === 'confirmation' && verified ?
                            <>
                                <h1 style={{ textAlign: 'center' }}>Account Alredy Verified </h1>
                                <Alert severity="warning"> This account already has been validated.</Alert>
                            </> : type === 'recovery' && verified ?
                                <>
                                    <h1 style={{ textAlign: 'center' }}>Password Recovery</h1>
                                    <Alert severity="info">This link was already used before and your password already changed.</Alert>
                                </> : <></>
                        }

                        <Divider variant="middle" />
                        <div style={{ textAlign: 'center' }} >
                            Don't remember your password? <a href='#'> Password Recovery</a>.
                        </div>
                    </Box>
                </Container> :
                <Container maxWidth="sm">
                    <Box sx={{ height: '100vh' }}>
                        <CardMedia
                            component="img"
                            image={logo}
                            alt="Ricardo Briceño's Authentication System"
                        />

                        {type === 'confirmation' ?
                            <>
                                <h1 style={{ textAlign: 'center' }}> Account Verified</h1>
                                <Alert severity="success"> You have sucessfully verified your acount. You can now authenticate yourself in the system.</Alert>
                            </> : type === 'recovery' ?
                                <>
                                    <h1 style={{ textAlign: 'center' }}>Password Recovery</h1>
                                    {!passchanged ? <><Alert severity="info"> Enter your new password. We remind you that it is important that you do not share it with anyone. </Alert>
                                        <Box component="form" onSubmit={recovery} noValidate sx={{ mt: 1 }}>
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="New password"
                                                name="original-password"
                                                autoComplete="password-1"
                                                autoFocus
                                            />
                                            <TextField
                                                margin="normal"
                                                required
                                                fullWidth
                                                label="Confirm password"
                                                name="clone-password"
                                                autoComplete="password-2"
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
                                    </>
                                        : <Alert severity="success"> Password Successfully Changed. </Alert>}
                                </> : <></>
                        }
                        <Divider variant="middle" />
                        <div style={{ textAlign: 'center' }} >
                            If you not remember your password any email you can <a href='#'> reset your password </a>.
                        </div>
                    </Box>
                </Container>}
        </Fragment>)
}

