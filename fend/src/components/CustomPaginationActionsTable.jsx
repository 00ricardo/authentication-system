import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Chip from '@mui/material/Chip';
import ModeIcon from '@mui/icons-material/Mode';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem'
import Select from '@mui/material/Select';
import axios from 'axios'

const columns = [
    'Name', 'Last Name',
    ' Username', 'Role', 'Active', '']

const roles = {
    1: 'Unregistered',
    2: 'Normal',
    3: 'Admin'
}

const roleMenu = ['Unregistered', 'Normal', 'Admin']


export default function CustomPaginationActionsTable(props) {
    const [data, setData] = React.useState([])
    const [editRowId, setEditRowId] = React.useState(null)
    const [eRole, setERole] = React.useState(null)
    const [eLName, setELName] = React.useState(null)

    const fetchData = () => {
        setData(props.data)
    }

    const handleLName = (e) => {
        setELName(e.target.value)
    }

    const handleEdition = (id) => {
        setEditRowId(id)
    }

    const findIdxUser = (users, user) => {
        var index
        users.forEach((usr, idx) => {
            if (usr.id === user.id) {
                index = idx
            }
        });
        return index
    }

    const handleSubmit = async (id) => {
        let data = { id: id }

        if (eLName) {
            data['last_name'] = eLName
        }

        if (eRole) {
            data['role'] = eRole.toLowerCase()
        }

        try {
            await axios.put(`http://localhost:5000/authapi/user/${id}`, data,
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {
                    let data = response.data
                    if (response.status === 200) {
                        let idx = findIdxUser(props.data, data.status.data)
                        props.data[idx] = data.status.data
                    }
                    else {
                        console.log(response.data)
                    }
                })
        } catch (error) {
            console.log(error.response.data);
        }
        setEditRowId(null)
        setERole(null)
        setELName(null)
    }

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/authapi/user/${id}`,
                {
                    headers: {
                        'Authorization': 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((response) => {

                    if (response.status === 200) {
                        props.setUsers(props.data.filter((usr) => usr.id !== id));
                    }
                    else {
                        console.log(response.data)
                    }
                })
        } catch (error) {
            console.log(error);
        }

        setEditRowId(null)
    }

    const handleRoleI = (event) => {
        setERole(event.target.value);
    };

    React.useEffect(() => {
        fetchData()
    })

    return (
        <>
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                            {columns.map((c) => (
                                <TableCell key={c} align='left'>{c}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row) => (
                            <TableRow
                                key={row.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell align="left">{row.first_name}</TableCell>

                                <TableCell align="left"> {editRowId === row.id ?
                                    <TextField
                                        required
                                        id="u-name"
                                        name="u-name"
                                        defaultValue={row.last_name}
                                        autoFocus
                                        onChange={handleLName}
                                    /> : row.last_name}
                                </TableCell>
                                <TableCell align="left">{row.username}</TableCell>
                                <TableCell align="left">{editRowId === row.id ?
                                    <Select
                                        labelId="demo-simple-select-label"
                                        id="demo-simple-select"
                                        defaultValue={roles[row.groupId]}
                                        label="Age"
                                        onChange={handleRoleI}
                                    >
                                        {roleMenu.map((roleI) => (
                                            <MenuItem key={roleI} value={roleI}>{roleI}</MenuItem>
                                        ))}

                                    </Select> : roles[row.groupId]}
                                </TableCell>
                                <TableCell align="left" >
                                    {row.active ?
                                        <Chip variant="filled" color="success" size="small" label='Yes' />
                                        : <Chip variant="filled" color="warning" size="small" label='No' />}
                                </TableCell>
                                <TableCell align="left">
                                    <div>
                                        {editRowId === row.id ?
                                            <div>
                                                <CheckIcon onClick={() => handleSubmit(row.id)} style={{ cursor: 'pointer' }} />
                                                <ClearIcon onClick={() => setEditRowId(null)} style={{ cursor: 'pointer' }} />
                                            </div> :
                                            <div>
                                                <ModeIcon onClick={() => handleEdition(row.id)} style={{ cursor: 'pointer' }} />
                                                <ClearIcon onClick={() => handleDelete(row.id)} style={{ cursor: 'pointer' }} />
                                            </div>
                                        }
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    );
}
