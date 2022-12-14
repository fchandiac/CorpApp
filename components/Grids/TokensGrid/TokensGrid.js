import { React, useState, useEffect, useRef } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'
import AppDataGrid from '../../AppDataGrid'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button } from '@mui/material'
import moment from 'moment'

const tokens = require('../../../promises/tokens')
const records = require('../../../promises/records')

export default function TokensGrid() {
    const router = useRouter()
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState({})
    const [tokensList, setTokensList] = useState([])
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

    useEffect(() => {
        tokens.findAll()
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    rut: (item.Student == null ? '' : item.Student.rut),
                    lesson: (item.Lesson == null ? '' : item.Lesson.name),
                    name: (item.Student == null ? '' : item.Student.name),
                    createdAt: moment(item.createdAt).format('DD-MM-YYYY HH:mm'),
                    expiration: moment(item.expiration).format('DD-MM-YYYY HH:mm'),
                    sale_id: item.sale_id,
                    state: stateStr(item.state)
                }))
                setTokensList(data)
            })
            .catch(err => { console.error(err) })
    }, [])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
        { field: 'sale_id', headerName: 'Id venta', flex: .6, type: 'number' },
        { field: 'rut', headerName: 'Rut', flex: .8 },
        { field: 'name', headerName: 'Nombre', flex: 1.8 },
        { field: 'lesson', headerName: 'Taller', flex: 1.2 },
        { field: 'state', headerName: 'Estado', flex: .8 },
        { field: 'createdAt', headerName: 'Fecha venta', flex: 1.2, type: 'date' },
        { field: 'expiration', headerName: 'Fecha expiraci??n', flex: 1.2, type: 'date' },
        {
            field: 'actions',
            headerName: '',
            type: 'actions', flex: .8, getActions: (params) => [
                <GridActionsCellItem
                    sx={{ ...(router.query.profileDelete == 'false' && { display: 'none' }) }}
                    label='delete'
                    icon={<DeleteIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            name: params.row.name,
                            lesson: params.row.lesson

                        }), setOpenDeleteDialog(true)
                    }}
                />
            ]
        }
    ]

    const destroy = () => {
        tokens.destroy(rowData.id)
            .then(() => {
                records.create(
                    'cr??ditos',
                    'elimina',
                    'cr??dito ' + rowData.id + ' de ' + rowData.name,
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


    return (

        <>
            <AppDataGrid rows={tokensList} columns={columns} title={'Cr??ditos'} height='78vh' setGridApiRef={setGridApiRef} />

            <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Eliminar cr??dito
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
                                label='Estudiante'
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
                            <TextField
                                label='Taller'
                                value={rowData.lesson}
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
        </>
    )
}


/* Tokens State 
    1: available
    2: expired
    3: used */

function stateStr(state) {
    let stateStr = ''
    if (state == 1) {
        stateStr = 'disponible'
    } else if (state == 2) {
        stateStr = 'expirado'
    } else if (state == 3) {
        stateStr = 'usado'
    }

    return stateStr
}