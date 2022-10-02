import React, { useEffect, useState } from 'react';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../img/shield-logo.png'
import { useNavigate } from "react-router-dom";
import axios from 'axios'

export default function Navbar() {
    const [anchorElUser, setAnchorElUser] = useState(null);
    const [username, setUsername] = useState(null);

    const handleOpenUserMenu = (event) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const navigate = useNavigate();

    const ff = ({ parent }) => {
        console.log("a")
        console.log(parent)
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
                localStorage.removeItem('token')
                if (!JSON.parse(localStorage.getItem('usr')).remember) {
                    localStorage.removeItem('usr')
                }
                navigate("/");
            })
        } catch (error) {
            if (error.response.status !== 200) {
                //setError(error.response.data.status.message)
                console.log(error)
            }

        }
    }

    const settings = [{ Profile: ff }, { Account: ff }, { Dashboard: ff }, { Logout: logout }];

    useEffect(() => {
        if (localStorage.getItem('usr')) {
            setUsername((JSON.parse(localStorage.getItem('usr')).username).toUpperCase())
        }
    }, [username])

    return (
        <Toolbar disableGutters style={{ justifyContent: 'space-between', margin: 'auto 25px' }}>
            <a href="/system">
                <img src={logo} style={{ height: '70px', cursor: 'pointer' }} alt='Authentication System RB' />
            </a>
            <Box sx={{ flexGrow: 0 }}>
                <Tooltip title="Open settings">
                    <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                        <Avatar alt={username} src="xd" />
                    </IconButton>
                </Tooltip>
                <Menu
                    sx={{ mt: '45px' }}
                    id="menu-appbar"
                    anchorEl={anchorElUser}
                    anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    keepMounted
                    transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                    }}
                    open={Boolean(anchorElUser)}
                    onClose={handleCloseUserMenu}
                >
                    {settings.map((sett) => (
                        <MenuItem key={Object.keys(sett)}>
                            <Button variant="text" onClick={sett[Object.keys(sett)]}>{Object.keys(sett)}</Button>
                        </MenuItem>
                    ))}
                </Menu>
            </Box>
        </Toolbar>

    );
};
