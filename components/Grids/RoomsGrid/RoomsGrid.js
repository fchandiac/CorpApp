import { React, useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import AppDataGrid from '../../AppDataGrid/AppDataGrid'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button } from '@mui/material'
import AppErrorSnack from '../../AppErrorSnack'


const records = require('../../../promises/records')
const rooms = require('../../../promises/rooms')

export default function RoomsGrid(props) {
    const { updateState } = props
    const router = useRouter()
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState({})
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [roomsList, setRoomsList] = useState([])
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [textErrorSnack, setTextErrorSnack] = useState('')


    useEffect(() => {
        rooms.findAll()
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    name: item.name
                }))
                setRoomsList(data)
            })
            .catch(err => { console.error(err) })
    }, [updateState])


    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'name', headerName: 'Nombre', flex: 2 },
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
                            name: params.row.name
                        }), setOpenInfoDialog(true)
                    }}
                />

            ]
        }
    ]

    const destroy = () => {
        rooms.destroy(rowData.id)
            .then(() => {
                records.create(
                    'salas',
                    'elimina',
                    'sala: ' + rowData.name,
                    router.query.userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
                        setOpenDeleteDialog(false)
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })
    }

    const update = (e) => {
        e.preventDefault()
        rooms.update(rowData.id,  rowData.name)
            .then(() => {
                records.create(
                    'salas',
                    'elimina',
                    'sala: ' + rowData.id,
                    router.query.userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{
                            id: rowData.rowId,
                            name: rowData.name,
                        }])
                        setOpenInfoDialog(false)
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => {
                console.error(err)
                if (err.errors[0].message == 'name must be unique') {
                    setTextErrorSnack('El nombre ingresado ya existe')
                    setOpenErrorSnack(true)
                }
            })
    }
    return (
        <>
            <AppDataGrid rows={roomsList} columns={columns} title={'Salas'} height='78vh' setGridApiRef={setGridApiRef} />

            <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Eliminar Sala
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

            <Dialog open={openInfoDialog} maxWidth={'xs'} fullWidth>
                <form onSubmit={update}>
                    <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                        {'Información del Profesor'}
                    </DialogTitle>
                    <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                        <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                            <Grid item >
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
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                        <Button type='submit' variant={'contained'}>Actualizar</Button>
                        <Button variant={'outlined'} onClick={() => { setOpenInfoDialog(false) }} >cerrar</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={textErrorSnack} />
        </>
    )
}
