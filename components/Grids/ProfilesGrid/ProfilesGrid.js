import { React, useEffect, useState } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import AppDataGrid from '../../AppDataGrid/AppDataGrid'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, FormControlLabel, Switch } from '@mui/material'
import AppErrorSnack from '../../AppErrorSnack'

const profiles = require('../../../promises/profiles')
const records = require('../../../promises/records')

export default function ProfilesGrid(props) {
    const { updateState } = props
    const router = useRouter()
    const [profileDelete, setProfileDelete] = useState(router.query.profileDelete)
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState({})
    const [profilesList, setProfilesList] = useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [textErrorSnack, setTextErrorSnack] = useState('')
    
   

    useEffect(() => {
        profiles.findAll()
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    name: item.name,
                    admin: item.admin,
                    delete: item.delete,
                    update: item.update
                }))
                setProfilesList(data)
            })

    }, [updateState])


    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'name', headerName: 'Funcionario', flex: 2 },
        { field: 'admin', headerName: 'Adminsitarción', flex: 1, type: 'boolean' },
        { field: 'delete', headerName: 'Eliminar', flex: 1, type: 'boolean' },
        { field: 'update', headerName: 'Actualizar', flex: 1, type: 'boolean' },

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
                            name: params.row.name,
                        })
                        setOpenDeleteDialog(true)
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
                            name: params.row.name,
                            admin: params.row.admin,
                            delete: params.row.delete,
                            update: params.row.update
                        })
                        setOpenInfoDialog(true)
                    }}
                />

            ]
        }

    ]

    const destroy = () => {
        profiles.destroy(rowData.id)
            .then(() => {
                records.create(
                    'perfiles',
                    'elimina',
                    'perfil ' + rowData.name,
                    router.query.userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
                        setOpenDeleteDialog(false)
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => {
                console.log(err)
            })
    }

    const update = () => {
        profiles.update(
            rowData.id,
            rowData.name,
            rowData.admin,
            rowData.delete,
            rowData.update
        )
            .then(() => {
                records.create(
                    'perfiles',
                    'actualiza',
                    'perfil ' + rowData.name,
                    router.query.userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{ 
                            id: rowData.rowId, 
                            name: rowData.name,
                            admin: rowData.admin,
                            delete:rowData.delete,
                            update: rowData.update
                        }])
                        setOpenInfoDialog(false)
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => {
                if (err.errors[0].message == 'name must be unique') {
                    setTextErrorSnack('El nombre del privilegio ingresado ya existe')
                    setOpenErrorSnack(true)
                }
            })

    }


    return (
        <>
            <AppDataGrid rows={profilesList} columns={columns} title={'Privilegios'} height='78vh' setGridApiRef={setGridApiRef} />
            <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Eliminar Privilegio
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
                                label='Nombre'
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
                            <TextField label="Nombre"
                                value={rowData.name}
                                onChange={(e) => {
                                    setRowData({
                                        ...rowData,
                                        name: e.target.value
                                    })
                                }}
                                variant="outlined"
                                size={'small'}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                control=
                                {<Switch
                                    checked={rowData.admin}
                                    onChange={(e) => {
                                        setRowData({
                                            ...rowData,
                                            admin: e.target.checked
                                        })
                                    }}
                                />} label="Admnistración" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                control=
                                {<Switch
                                    checked={rowData.delete}
                                    onChange={(e) => {
                                        setRowData({
                                            ...rowData,
                                            delete: e.target.checked
                                        })
                                    }}
                                />} label="Eliminar" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                control=
                                {<Switch
                                    checked={rowData.update}
                                    onChange={(e) => {
                                        setRowData({
                                            ...rowData,
                                            update: e.target.checked
                                        })
                                    }}
                                />} label="Actualizar" />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    <Button variant={'contained'} onClick={update} >Actualizar</Button>
                    <Button variant={'outlined'} onClick={() => { setOpenInfoDialog(false) }} >cerrar</Button>
                </DialogActions>
            </Dialog>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={textErrorSnack}/>                

        </>
    )
}
