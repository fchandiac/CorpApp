import { React, useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import AppDataGrid from '../../AppDataGrid/AppDataGrid'
import moment from 'moment'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, Autocomplete } from '@mui/material'

const users = require('../../../promises/users')
const records = require('../../../promises/records')
const profiles = require('../../../promises/profiles')

export default function UsersGrid(props) {
    const { updateState } = props
    const router = useRouter()
    const [usersList, setUsersList] = useState([])
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState({})
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [profilesOptions, setProfilesOptions] = useState([])
    const [inputProfileValue, setInputProfileValue] = useState('')

    useEffect(() => {
        profiles.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    label: item.name,
                    id: item.id
                }))
                setProfilesOptions(data)
            })
    }, [])

    useEffect(() => {
        users.findAll()
            .then(res => {
                let data = res.map(item =>
                    
                ({
                    id: item.id,
                    user: item.user,
                    name: item.name,
                    profileName: (item.Profile == null? 'eliminado': item.Profile.name),
                    profile: { 
                        key: (item.Profile == null? 'eliminado': item.Profile.id), 
                        label: (item.Profile == null? 'eliminado': item.Profile.name), 
                        id: (item.Profile == null? 'eliminado': item.Profile.id) },
                    createdAt: moment(item.createdAt).format('DD-MM-YYY HH:mm:ss')
                })
                )
                setUsersList(data)
            })
            .catch(err => { console.error(err) })
    }, [updateState])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'user', headerName: 'Usuario', flex: 1.5 },
        { field: 'name', headerName: 'Funcionario', flex: 2 },
        { field: 'profileName', headerName: 'Privilegios', flex: 1 },
        { field: 'createdAt', headerName: 'Creación', flex: .8, type: 'date' },
        {
            field: 'actions',
            headerName: '',
            type: 'actions', flex: .5, getActions: (params) => [
                <GridActionsCellItem
                    sx={{ ...(router.query.profileDelete == 'false' && { display: 'none' }) }}
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            user: params.row.user,
                            name: params.row.name,
                            profileName: params.row.profileName

                        }), setOpenDeleteDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    sx={{ ...(router.query.profileUpdate == 'false' && { display: 'none' }) }}
                    label='info'
                    icon={<InfoIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            user: params.row.user,
                            name: params.row.name,
                            profileName: params.row.profileName,
                            profile: { key: params.row.id, label: params.row.profileName, id: params.row.id },

                        }), setOpenInfoDialog(true)
                    }}
                />

            ]
        }

    ]

    const destroy = () => {
        users.destroy(rowData.id)
            .then(() => {
                records.create(
                    'usuarios',
                    'elimina',
                    'usuario ' + rowData.name,
                    router.query.userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
                        setOpenDeleteDialog(false)
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => {
                console.log(err => { console.error(err) })
            })

    }

    const update = () => {
        users.updateProfile(rowData.id, rowData.profile.id)
            .then(() => {
                records.create(
                    'usuarios',
                    'actualiza',
                    'privilegios a' + rowData.profile.name,
                    router.query.userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{ id: rowData.rowId, profileName: rowData.profile.label }])
                        setOpenInfoDialog(false)
                    })
                    .catch(err => {console.error(err)})
            })
            .catch(err => { console.error(err) })

    }
    
    return (
        <>
            <AppDataGrid rows={usersList} columns={columns} title={'Usuarios'} height='78vh' setGridApiRef={setGridApiRef} />
            <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Eliminar Usuario
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Grid container sx={{ p: 1 }} spacing={1} direction="column">
                        <Grid item>
                            <TextField
                                label='Id'
                                value={rowData.id}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label='Nombre de usuario'
                                value={rowData.user}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label='Funcionario'
                                value={rowData.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    <Button variant={'contained'} onClick={destroy} >Eliminar</Button>
                    <Button variant={'outlined'} onClick={() => { setOpenDeleteDialog(false) }} >cerrar</Button>
                </DialogActions>
            </Dialog>


            <Dialog open={openInfoDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Información del Privilegio
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Grid container sx={{ p: 1 }} spacing={1} direction="column">
                        <Grid item>
                            <TextField
                                label='Id'
                                value={rowData.id}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label='Nombre de usuario'
                                value={rowData.user}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <TextField
                                label='Funcionario'
                                value={rowData.name}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="standard"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <Autocomplete
                                inputValue={inputProfileValue}
                                onInputChange={(e, newInputValue) => {
                                    setInputProfileValue(newInputValue);
                                }}
                                value={rowData.profile}
                                onChange={(e, newValue) => {
                                    setRowData({ ...rowData, profile: newValue })
                                }}
                                disablePortal
                                options={profilesOptions}
                                renderInput={(params) => <TextField {...params} label='Privilegios' size={'small'} fullWidth required />}
                            />
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    <Button variant={'contained'} onClick={update} >Actualizar</Button>
                    <Button variant={'outlined'} onClick={() => { setOpenInfoDialog(false) }} >cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
