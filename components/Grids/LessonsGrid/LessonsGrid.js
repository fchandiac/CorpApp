import { React, useState, useEffect, useRef } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import AppDataGrid from '../../AppDataGrid/AppDataGrid'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, Autocomplete, IconButton } from '@mui/material'
import LessonListGrid from '../LessonListGrid/LessonListGrid'
import ReactToPrint from 'react-to-print'
import PrintIcon from '@mui/icons-material/Print'
import AppErrorSnack from '../../AppErrorSnack'


const records = require('../../../promises/records')
const lessons = require('../../../promises/lessons')
const teachers = require('../../../promises/teachers')

export default function LessonsGrid(props) {
    const { updateState } = props
    const router = useRouter()
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState({})
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false)
    const [lessonsDataList, setlessonsDataList] = useState([])
    const LessonsListPrint = useRef(null)
    const [inputTeacherValue, setInputTeacherValue] = useState('')
    const [teachersOptions, setTeachersOptions] = useState([])
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [textErrorSnack, setTextErrorSnack] = useState('')

    useEffect(() => {
        teachers.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    label: item.name,
                    id: item.id
                }))
                setTeachersOptions(data)
            })
    }, [])

    useEffect(() => {
        lessons.findAll()
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    name: item.name,
                    quota: item.quota,
                    teacherName: (item.Teacher == null ? 'eliminado' : item.Teacher.name),
                    teacher: {
                        key: (item.Teacher == null ? null : item.Teacher.id),
                        label: (item.Teacher == null ? 'eliminado' : item.Teacher.name),
                        id: (item.Teacher == null ? null : item.Teacher.id)
                    }
                }))
                setlessonsDataList(data)
            })
    }, [updateState])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'name', headerName: 'Nombre', flex: 1 },
        { field: 'quota', headerName: 'Cupo', flex: .8, type: 'number' },
        { field: 'teacherName', headerName: 'Profesor', flex: 1.5 },
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

                        }), setOpenDeleteDialog(true)
                    }}
                />,
                <GridActionsCellItem
                    // sx={{ ...(router.query.profileUpdate == 'false' && { display: 'none' }) }}
                    label='info'
                    icon={<ListAltIcon />}
                    onClick={() => {
                        setRowData({
                            rowId: params.id,
                            id: params.row.id,
                            name: params.row.name,
                            quota: params.row.quota,
                            teacherName: params.row.teacherName,
                            teacher: params.row.teacher

                        }), setOpenInfoDialog(true)
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
                            quota: params.row.quota,
                            teacherName: params.row.teacherName,
                            teacher: params.row.teacher
                        }), setOpenUpdateDialog(true)
                    }}
                />

            ]
        }
    ]

    const destroy = () => {
        lessons.destroy(rowData.id)
            .then(() => {
                records.create(
                    'talleres',
                    'elimina',
                    'taller ' + rowData.name,
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
        lessons.update(rowData.id, rowData.name, rowData.teacher.id, rowData.quota)
            .then(() => {
                records.create(
                    'talleres',
                    'actualiza',
                    'taller: ' + rowData.id,
                    router.query.userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{
                            id: rowData.rowId,
                            name: rowData.name,
                            quota: rowData.quota,
                            teacherName: rowData.teacher.label,
                            teacher: rowData.teacher
                        }])
                        setOpenUpdateDialog(false)
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
            <AppDataGrid rows={lessonsDataList} columns={columns} title={'Talleres'} height='78vh' setGridApiRef={setGridApiRef} />

            <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Eliminar Taller
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

            <Dialog open={openInfoDialog} maxWidth={'md'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    {'Lista del taller ' + rowData.name}
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <LessonListGrid lessonId={rowData.id} lessonName={rowData.name} LessonsListPrint={LessonsListPrint}/>
                </DialogContent>
                <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    <ReactToPrint
                        content={() => LessonsListPrint.current}
                        pageStyle={'print'}
                        trigger={() => {
                            return (
                                <IconButton>
                                    <PrintIcon />
                                </IconButton>
                            )
                        }}>
                    </ReactToPrint>
                    <Button variant={'outlined'} onClick={() => { setOpenInfoDialog(false) }} >cerrar</Button>
                </DialogActions>
            </Dialog>

            <Dialog open={openUpdateDialog} maxWidth={'xs'} fullWidth>
                <form onSubmit={update}>
                    <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                        {'Información del Taller'}
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
                            <Grid item >
                                <TextField label="Cupo"
                                    value={rowData.quota}
                                    type={'number'}
                                    onChange={(e) => {
                                        setRowData({
                                            ...rowData, quota: e.target.value
                                        })
                                    }}
                                    variant="outlined"
                                    size={'small'}
                                    required
                                    fullWidth
                                />
                            </Grid>
                            <Grid item>
                                <Autocomplete
                                    inputValue={inputTeacherValue}
                                    onInputChange={(e, newInputValue) => {
                                        setInputTeacherValue(newInputValue);
                                    }}
                                    value={rowData.teacher}
                                    onChange={(e, newValue) => {
                                        setRowData({
                                            ...rowData, 
                                            teacher: newValue
                                         })
                                    }}
                                    disablePortal
                                    options={teachersOptions}
                                    renderInput={(params) => <TextField {...params} label='Profesor' size={'small'} fullWidth required />}
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                        <Button type='submit' variant={'contained'}>Actualizar</Button>
                        <Button variant={'outlined'} onClick={() => { setOpenUpdateDialog(false) }} >cerrar</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={textErrorSnack} />
        </>
    )
}
