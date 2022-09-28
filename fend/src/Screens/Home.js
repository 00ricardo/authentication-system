import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export default function Home() {
    const [users, setUsers] = useState([])
    const [err, setError] = useState(undefined)
    const navigate = useNavigate();

    const fetchUsers = async () => {
        try {
            await axios.get('http://localhost:5000/authapi/users', {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }
            )
                .then((response) => {
                    setUsers(response.data)
                })
        } catch (error) {
            if (error.response.status !== 200) {
                setError(error.response.data.status.message)
            }
            console.log(err)
        }
    }

    const logout = async () => {
        try {
            await axios.post('http://localhost:5000/authapi/logout', {
                username: 'xd',
                token: localStorage.getItem('token'),
            }, {
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                }
            }).then((response) => {
                console.log(response)
                localStorage.clear('token')
                navigate("/");
            })
        } catch (error) {
            if (error.response.status !== 200) {
                setError(error.response.data.status.message)

            }
            console.log(err)
        }
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            fetchUsers()
        } else {
            navigate("/");
        }
    }, [err])

    return (
        <div>
            {users.map((usr, idx) =>
                <div key={idx}> {usr.username}</div>
            )}
            <button onClick={logout}>Logout</button>
        </div>
    )
}
