import React, { useEffect } from 'react'
import axios from 'axios'

export default function ConfirmEmail() {

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
                })
        } catch (error) {
            console.log(error)
        }
    }
    useEffect(() => {
        verifyToken()
    })
    return (
        <div>
            <div>Ricardo</div>
        </div>


    )
}

