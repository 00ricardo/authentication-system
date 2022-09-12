import React, { useEffect, useState } from 'react'
import axios from 'axios'
export default function Home() {
    const [users, setUsers] = useState([])
    const [err, setError] = useState(undefined)

    const fetchUsers = async () => {
        try {
            await axios.get('http://localhost:5000/authapi/users', {
                headers: {
                    'Authorization': 'Bearer ' + sessionStorage.getItem('token')
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

    useEffect(() => {
        fetchUsers()
    }, [err])

    return (
        <div>
            {users.map((usr, idx) =>
                <div key={idx}> {usr.username}</div>
            )}
        </div>
    )
}
