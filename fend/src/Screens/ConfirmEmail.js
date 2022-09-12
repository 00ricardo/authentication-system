import React, { useEffect, useState, Fragment } from 'react'
import axios from 'axios'

import logo from '../img/logo.jpg'
import Divider from '@mui/material/Divider';
import CardMedia from '@mui/material/CardMedia';
import Alert from '@mui/material/Alert';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
export default function ConfirmEmail() {

    const [verified, setVerified] = useState(false)

    const verifyToken = async () => {
        let params = new URL(document.location).searchParams;
        try {
            await axios.put('http://localhost:5000/authapi/confirm-email', {
                token: params.get('confirmation_token'),
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
                    }
                })
        } catch (error) {
            console.log(error.response.data)
            setVerified(true)
        }
    }
    useEffect(() => {
        verifyToken()
    }, [verified])
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
                        <h1 style={{ textAlign: 'center' }}>Account Alredy Verified </h1>
                        <Alert severity="warning"> This account already has been validated.</Alert>
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
                        <h1 style={{ textAlign: 'center' }}>Account Verified</h1>
                        <Alert severity="success"> You have sucessfully verified your acount. You can now authentica yourself in the system.</Alert>
                        <Divider variant="middle" />
                        <div style={{ textAlign: 'center' }} >
                            If you not remember your password any email you can <a href='#'> reset your password </a>.
                        </div>
                    </Box>
                </Container>}
        </Fragment>)
}

