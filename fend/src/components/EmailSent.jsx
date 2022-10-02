import React, { Fragment } from 'react'
import Divider from '@mui/material/Divider';
import CardMedia from '@mui/material/CardMedia';
import Alert from '@mui/material/Alert';
import envelope from '../img/mail_sent.png'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
export default function EmailSent(props) {
    return (
        <Fragment>
            <CssBaseline />
            <Container maxWidth="sm">
                <Box sx={{ height: '100vh' }}>
                    <CardMedia
                        component="img"
                        image={envelope}
                        alt="Email Sent"
                    />
                    <h1 style={{ textAlign: 'center' }}>Email Confirmation</h1>
                    <Alert severity="success"> We have sent a email to <span style={{ color: "green" }}>{props.emailSent}</span> to confirm the validity of your email address. After receiving the email follow the link provided to complete your {props.type === 'confirmation' ? 'registration' : props.type === 'recovery' ? 'password recovery process' : ''}.</Alert>
                    <Divider variant="middle" />
                    <div style={{ textAlign: 'center' }} >
                        If you not receive any email <a href='#'> Resend confirmation email </a>.
                    </div>
                </Box>
            </Container>
        </Fragment>
    )
}
