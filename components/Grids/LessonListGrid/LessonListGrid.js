import { React, useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import AppDataGrid from '../../AppDataGrid/AppDataGrid'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import moment from 'moment'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, Autocomplete, Box, 
    TableContainer, Paper, TableHead, TableRow, TableCell, TableBody, Typography } from '@mui/material'

const lessonsLists = require('../../../promises/lessonslists')
const records = require('../../../promises/records')

export default function LessonListGrid(props) {
    const { lessonId, lessonName, LessonsListPrint } = props
    const router = useRouter()
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState({})
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
    const [lessonStudentsList, setLessonStudentsList] = useState([])
    const [rowsPrint, setRowsPrint] = useState([])



    useEffect(() => {
        lessonsLists.findAllByLesson(lessonId)
            .then(res => {
                let data = res.map(item => ({
                    id: item.id,
                    lessonId: item.LessonId,
                    studentId: item.Student.id,
                    studentRut: item.Student.rut,
                    studentName: item.Student.name,
                    createdAt: moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')
                }))
                setLessonStudentsList(data)
            })
    }, [lessonId])


    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'lessonId', headerName: 'Id Taller', flex: .5, type: 'number', hide: true },
        { field: 'studentId', headerName: 'Id Estudiante', flex: .5, type: 'number', hide: true },
        { field: 'studentRut', headerName: 'Rut', flex: 1 },
        { field: 'studentName', headerName: 'Nombre', flex: 1.5 },
        { field: 'createdAt', headerName: 'Fecha incripción', flex: 1.5 },
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
                            lessonId: params.row.lessonId,
                            studentId: params.row.studentId,
                            studentRut: params.row.studentRut,
                            studentName: params.row.studentName
                        })
                        setOpenDeleteDialog(true)
                    }}

                />
            ]
        }

    ]

    const destroy = () => {
        lessonsLists.destroy(rowData.id)
            .then(() => {
                records.create(
                    'lista de taller',
                    'elimina',
                    'estudiante ' + rowData.studentName + ' del taller ' + lessonName,
                    router.query.userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
                        setOpenDeleteDialog(false)
                    })
                    .catch(err => { console.error(err) })


            })
            .catch(err => { console.log(err) })
    }

    return (
        <>

            <AppDataGrid rows={lessonStudentsList} columns={columns} title={'Estudiantes'} height='60vh' setGridApiRef={setGridApiRef} />
            <Dialog open={openDeleteDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Eliminar Estudiante del taller
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Grid container sx={{ p: 1 }} spacing={1} direction="column">
                        <Grid item>
                            <TextField
                                label='Nombre'
                                value={rowData.studentName}
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

            <Box ref={LessonsListPrint} sx={{ display: 'none', displayPrint: 'block' }}>
                <Typography fontSize={18} paddingBottom={2}>
                    {'Lista estudiantes ' + lessonName + ' ' + moment(new Date()).format('DD-MM-YYYY')}
                </Typography>
                <TableContainer sx={{ width: '100%', border: 0 }}>
                    <TableHead sx={{backgroundColor: '#eceff1' }}>
                        <TableRow >
                            <TableCell sx={{ width: '20%' }}>Rut</TableCell>
                            <TableCell sx={{ width: '40%' }}>Nombre</TableCell>
                            <TableCell sx={{ width: '100%' }}>Fecha de Inscripción</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            lessonStudentsList.map((row) => (
                                <TableRow key={row.id} sx={{ width: '100%', height:'12px' }}>
                                    <TableCell>{row.studentRut}</TableCell>
                                    <TableCell>{row.studentName}</TableCell>
                                    <TableCell >{row.createdAt}</TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </TableContainer>
            </Box>
        </>
    )
}
