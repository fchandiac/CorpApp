import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Autocomplete, TextField } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppPaper from '../../AppPaper'
import { useRouter } from 'next/router'

const lessonsLists = require('../../../promises/lessonslists')
const records = require('../../../promises/records')
const utils = require('../../../utils')
const students = require('../../../promises/students')

export default function StudentDialog(props) {
    const { openDialog, setOpenDialog, rowData, gridApiRef, setRowData } = props
    const router = useRouter()
    const [inputLessonsValue, setinputLessonsValue] = useState('')
    const [lessonsOptions, setLessonsOptions] = useState([])
    const [inscriptionData, setInscriptionData] = useState(inscriptionDataDefault())
    const [inscriptionState, setInscriptionState] = useState(false)



    useEffect(() => {
        lessonsLists.IncriptionListByStudente(rowData.id)
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    label: item.name,
                    id: item.id
                }))
                setLessonsOptions(data)
            })
    }, [openDialog, inscriptionState])


    const closeDialog = () => {
        setOpenDialog(false)
        setInscriptionData(inscriptionDataDefault())
    }

    const inscription = (e) => {
        e.preventDefault()
        lessonsLists.create(inscriptionData.lesson.id, rowData.id)
            .then(() => {
                records.create(
                    'lista de taller',
                    'inscribe',
                    'estudiante ' + rowData.name + ' en taller ' + inscriptionData.lesson.label,
                    router.query.userId
                )
                    .then(() => {
                        setInscriptionData(inscriptionDataDefault())
                        setInscriptionState(inscriptionState ? false : true)
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })

    }

    const update = (e) => {
        e.preventDefault()
        students.update(
            rowData.id,
            rowData.rut,
            rowData.name,
            rowData.phone,
            rowData.mail,
            rowData.address
        ).then(() => {
                records.create(
                    'estudiantes',
                    'actualiza',
                    'estudiante: ' + rowData.id,
                    router.query.userId
                )
                    .then(() => {
                        gridApiRef.current.updateRows([{
                            id: rowData.rowId,
                            rut: rowData.rut,
                            name: rowData.name,
                            phone: rowData.phone,
                            mail: rowData.mail,
                            address: rowData.address
                        }])
                        closeDialog()
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => {
                console.error(err)
                if (err.errors[0].message == 'rut must be unique') {
                    setTextErrorSnack('El rut ingresado ya existe')
                    setOpenErrorSnack(true)
                } else if (err.errors[0].message == 'name must be unique') {
                    setTextErrorSnack('El nombre ingresado ya existe')
                    setOpenErrorSnack(true)
                }
            })
    }

    return (
        <>
            <Dialog open={openDialog} maxWidth={'lg'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Información del Estudiante
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Grid container sx={{ p: 1 }} spacing={1}>
                        <Grid item xs={8} sm={8} md={8}>
                            <AppPaper title={'Estudiante'}>
                                <form onSubmit={update}>
                                    <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                                        <Grid item >
                                            <TextField label="Rut"
                                                value={rowData.rut}
                                                onChange={(e) => {
                                                    setRowData({
                                                        ...rowData,
                                                        rut: utils.formatRut(e.target.value)
                                                    })
                                                }}
                                                variant="outlined"
                                                size={'small'}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
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
                                            <TextField label="Teléfono"
                                                value={rowData.phone}
                                                onChange={(e) => {
                                                    setRowData({
                                                        ...rowData,
                                                        phone: e.target.value
                                                    })
                                                }}
                                                variant="outlined"
                                                size={'small'}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item >
                                            <TextField label="Mail"
                                                value={rowData.mail}
                                                onChange={(e) => {
                                                    setRowData({
                                                        ...rowData,
                                                        mail: e.target.value
                                                    })
                                                }}
                                                variant="outlined"
                                                size={'small'}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item >
                                            <TextField label="Dirección"
                                                value={rowData.address}
                                                onChange={(e) => {
                                                    setRowData({
                                                        ...rowData,
                                                        address: e.target.value
                                                    })
                                                }}
                                                variant="outlined"
                                                size={'small'}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item textAlign={'right'} >
                                            <Button
                                                sx={{ ...(router.query.profileUpdate == 'false' && { display: 'none' }) }}
                                                variant={'contained'}
                                                type='submit'>Actualizar</Button>
                                        </Grid>

                                    </Grid>
                                </form>
                            </AppPaper>
                        </Grid>
                        <Grid item xs={4} sm={4} md={4}>
                            <form onSubmit={inscription}>
                                <AppPaper title={'Inscribir en taller'}>
                                    <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                                        <Grid item>
                                            <Autocomplete
                                                inputValue={inputLessonsValue}
                                                onInputChange={(e, newInputValue) => {
                                                    setinputLessonsValue(newInputValue);
                                                }}
                                                value={inscriptionData.lesson}
                                                onChange={(e, newValue) => {
                                                    setInscriptionData({ ...inscriptionData, lesson: newValue })
                                                }}
                                                disablePortal
                                                options={lessonsOptions}
                                                renderInput={(params) => <TextField {...params} label='Taller' size={'small'} fullWidth required />}
                                            />
                                        </Grid>
                                        <Grid item textAlign={'right'}>
                                            <Button variant={'contained'} type='submit'>Inscribir</Button>
                                        </Grid>
                                    </Grid>
                                </AppPaper>
                            </form>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    <Button variant={'outlined'} onClick={closeDialog} >cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function inscriptionDataDefault() {
    return ({
        lesson: { key: 0, label: '', id: 0 }
    })
}

function stdudentDataDefault() {
    return ({
        rut: '',
        name: '',
        phone: '',
        mail: '',
        address: '',
        gender: '',
        date_of_birth: moment().format('DD/MM/yyyy')
    })
}