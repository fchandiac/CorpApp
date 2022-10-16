import { React, useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import AddCardIcon from '@mui/icons-material/AddCard'
import QrCodeIcon from '@mui/icons-material/QrCode'
import AppDataGrid from '../../AppDataGrid/AppDataGrid'
import moment from 'moment'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, Autocomplete } from '@mui/material'
import StudentDialog from '../../Dialogs/StudentDialog'
import QrDialog from '../../Dialogs/QrDialog'


const records = require('../../../promises/records')
const students = require('../../../promises/students')
const utils = require('../../../utils')
const tokens = require('../../../promises/tokens')



export default function StudentsGrid(props) {
    const { updateState } = props
    const router = useRouter()
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState({})
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [openQrDialog, setOpenQrDialog] = useState(false)
    const [studentsList, setStudentsList] = useState([])
    const [rut, setRut] = useState('')


    useEffect(() => {
        students.findAll()
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    rut: item.rut,
                    name: item.name,
                    phone: item.phone,
                    mail: item.mail,
                    address: item.address,
                    gender: item.gender,
                    age: utils.yearsOld(item.date_of_birth),
                    date_of_birth: item.date_of_birth,
                    createdAt: moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss'),
                    
                }))
                setStudentsList(data)

            })
            .catch(err => { console.error(err) })
    }, [updateState])


    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'rut', headerName: 'Rut', flex: .8 },
        { field: 'name', headerName: 'Nombre', flex: 1.8 },
        { field: 'phone', headerName: 'Teléfono', flex: .7 },
        { field: 'mail', headerName: 'Mail', flex: 1, hide: true },
        { field: 'address', headerName: 'Dirección', flex: 1, hide: true },
        { field: 'gender', headerName: 'Genero', flex: .5 },
        { field: 'age', headerName: 'Edad', flex: .5, type: 'number' },
        { field: 'createdAt', headerName: 'Ingreso', flex: .9, type: 'date', hide: true },
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
                            phone: params.row.phone,
                            mail: params.row.mail,
                            address: params.row.address,
                            gender: params.row.gender,
                            age: params.row.age,
                            date_of_birth: params.row.date_of_birth,
                            createdAt: params.row.createdAt

                        }), setOpenDeleteDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    sx={{ ...(router.query.profileDelete == 'false' && { display: 'none' }) }}
                    label='Qr'
                    icon={<QrCodeIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            name: params.row.name,
                            rut: params.row.rut

                        }), setOpenQrDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    label='info'
                    icon={<InfoIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            rut: params.row.rut,
                            name: params.row.name,
                            phone: params.row.phone,
                            mail: params.row.mail,
                            address: params.row.address,
                            gender: params.row.gender,
                            age: params.row.age,
                            date_of_birth: params.row.date_of_birth,
                            createdAt: params.row.createdAt,
                            tokensData: params.row.tokensData
                        }), setOpenInfoDialog(true)
                    }}
                />
            ]
        }
    ]

    const destroy = () => {
        students.destroy(rowData.id)
            .then(() => {
                records.create(
                    'estudiantes',
                    'elimina',
                    'estudiante: ' + rowData.name,
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
            <AppDataGrid rows={studentsList} columns={columns} title={'Estudiantes'} height='84vh' setGridApiRef={setGridApiRef} />
            <StudentDialog openDialog={openInfoDialog} setOpenDialog={setOpenInfoDialog} rowData={rowData} gridApiRef={gridApiRef} setRowData={setRowData} />
            <QrDialog openDialog={openQrDialog} setOpenDialog={setOpenQrDialog} rut={rowData.rut} name={rowData.name} />

            <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Eliminar Estudiante
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

           
        </>
    )
}

function tokensDataDefault() {
    return ({
        total: 0,
        used: 0,
        availables: 0,
        expired: 0,
    })
}







