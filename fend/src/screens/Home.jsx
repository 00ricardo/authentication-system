import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import Navbar from '../components/Navbar';
import CustomPaginationActionsTable from '../components/CustomPaginationActionsTable';


export default function Home() {
    const [users, setUsers] = useState([])
    const [frender, setFRender] = useState(true)
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
                    if (response.status === 200) {
                        setUsers(response.data)
                        setFRender(false)
                    }
                })
        } catch (error) {
            if (error.response.status === 400) {
                setError(error.response.data.status.message)
                navigate("/");
            }
            else if (error.response.status === 401) {
                navigate("/");
            } else {
                console.log(err)
            }
        }
        return
    }

    useEffect(() => {
        if (localStorage.getItem('token')) {
            if (frender) {
                fetchUsers()
            }

        } else {
            navigate("/");
        }
    }, [err, users])

    return (
        <>
            <Navbar />
            <CustomPaginationActionsTable data={users} />
        </>
    )
}
