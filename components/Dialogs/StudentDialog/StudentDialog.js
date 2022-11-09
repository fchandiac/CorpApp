import {
    Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Autocomplete, TextField,
    FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppPaper from '../../AppPaper'
import { useRouter } from 'next/router'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import moment from 'moment'
import StudentLessonCard from '../../Cards/StudentLessonCard'


const lessonsLists = require('../../../promises/lessonslists')
const records = require('../../../promises/records')
const utils = require('../../../utils')
const students = require('../../../promises/students')
const sales = require('../../../promises/sales')
const tokens = require('../../../promises/tokens')

export default function StudentDialog(props) {
    const { openDialog, setOpenDialog, rowData, gridApiRef, setRowData } = props
    const router = useRouter()
    const [inputInscriptionLessonValue, setinputInscriptionLessonValue] = useState('')
    const [lessonsIscriptionOptions, setLessonsIscriptionOptions] = useState([])
    const [inscriptionData, setInscriptionData] = useState(inscriptionDataDefault())
    const [inputTokenLessonValue, setInputTokenLessonValue] = useState('')
    const [lessonsTokensOptions, setLessonsTokensOptions] = useState([])
    const [updateState, setUpdateState] = useState(false)
    const [saleData, setSaleData] = useState(saleDataDefault())
    const [totalTokens, setTotalTokens] = useState(0)
    const [availablesTokens, setAvailablesTokens] = useState(0)
    const [usedTokens, setUsedTokens] = useState(0)
    const [expiredTokens, setExpiredTokens] = useState(0)



    useEffect(() => {
        setSaleData({ ...saleData, studentId: rowData.id })
    }, [openDialog])

    useEffect(() => {
        updateTokens()
    }, [openDialog])


    useEffect(() => {
        lessonsLists.findAllByStudent(rowData.id)
            .then(res => {
                let data = res.map(item => ({
                    key: item.Lesson.id,
                    label: item.Lesson.name,
                    id: item.Lesson.id
                }))
                setLessonsTokensOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [openDialog, updateState])


    useEffect(() => {
        lessonsLists.IncriptionListByStudente(rowData.id)
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    label: item.name,
                    id: item.id
                }))
                setLessonsIscriptionOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [openDialog, updateState])

    const updateTokens = () => {
        if (openDialog == false) {
            setTotalTokens(0)
            setAvailablesTokens(0)
            setUsedTokens(0)
            setExpiredTokens(0)
        } else {
            tokens.findAllByStudent(rowData.id)
                .then(res => {
                    setTotalTokens(res.length)
                })
                .catch(err => { console.error(err) })
            tokens.findAllAvailablesByStudent(rowData.id)
                .then(res => {
                    setAvailablesTokens(res.length)
                })
                .catch(err => { console.error(err) })
            tokens.findAllExpiredByStudent(rowData.id)
                .then(res => {
                    setExpiredTokens(res.length)
                })
                .catch(err => { console.error(err) })
            tokens.findAllUsedByStudent(rowData.id)
                .then(res => {
                    setUsedTokens(res.length)
                })
                .catch(err => { console.error(err) })
        }
    }



    const closeDialog = () => {
        setOpenDialog(false)
        setInscriptionData(inscriptionDataDefault())
        setSaleData(saleDataDefault())
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
                        setLessonsTokensOptions([])
                        setUpdateState(updateState ? false : true)
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
            rowData.address,
            rowData.gender,
            rowData.date_of_birth
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
                        address: rowData.address,
                        gender: rowData.gender,
                        age: utils.yearsOld(rowData.date_of_birth)
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

    const sale = (e) => {
        e.preventDefault()
        sales.create(
            saleData.lesson.id,
            rowData.id,
            saleData.quanty,
            saleData.amount,
            saleData.expiration
        )
            .then(res => {
                var promises = []
                for (var i = 0; i < saleData.quanty; i++) {
                    promises.push(tokens.create(saleData.lesson.id, rowData.id, res.id, saleData.expiration))
                }
                Promise.all(promises)
                    .then(() => {
                        records.create(
                            'ventas',
                            'vende',
                            saleData.quanty + ' créditos taller ' + saleData.lesson.label + ' ' + rowData.name,
                            router.query.userId
                        )
                            .then(() => {
                                setSaleData(saleDataDefault())
                                setLessonsTokensOptions([])
                                updateTokens()
                                setUpdateState(updateState ? false : true)
                            })
                            .catch(err => { console.error(err) })
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })
    }

    return (
        <>
            <Dialog open={openDialog} maxWidth={'md'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Información del Estudiante
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Grid container sx={{ p: 1 }} spacing={1}>
                        <Grid container sx={{ p: 1 }} spacing={1} xs={8} sm={8} md={8} direction="column">
                            <Grid item>
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
                                            <Grid item>
                                                <FormControl fullWidth size={'small'}>
                                                    <InputLabel >Genero</InputLabel>
                                                    <Select
                                                        value={rowData.gender}
                                                        label="Genero"
                                                        name='gender'
                                                        onChange={(e) => {
                                                            setRowData({
                                                                ...rowData,
                                                                gender: e.target.value
                                                            })
                                                        }}
                                                    >
                                                        <MenuItem value={'M'} >Masculino</MenuItem>
                                                        <MenuItem value={'F'} >Femenino</MenuItem>
                                                        <MenuItem value={'O'} >Otro</MenuItem>
                                                    </Select>
                                                </FormControl>
                                            </Grid>
                                            <Grid item >
                                                <DesktopDatePicker
                                                    label="Fecha de expiración"
                                                    inputFormat='DD-MM-YYYY'
                                                    value={rowData.date_of_birth}
                                                    onChange={(e) => {
                                                        setRowData({
                                                            ...rowData,
                                                            date_of_birth: moment(e).format('YYYY-MM-DD')
                                                        })
                                                    }}
                                                    renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
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
                            <Grid item>
                                <AppPaper title={'Talleres'}>
                                    <Grid container spacing={1} p={2}>
                                        {lessonsTokensOptions.map((item => (
                                            <Grid item key={item.id} sx={4} sm={4} md={4}>
                                                <StudentLessonCard
                                                    lessonId={item.id} lessonName={item.label} studentId={rowData.id} />
                                            </Grid>
                                        )))}
                                    </Grid>
                                </AppPaper>
                            </Grid>
                        </Grid>
                        <Grid container sx={{ paddingTop: 1 }} spacing={1} xs={4} sm={4} md={4} direction="column">
                            <Grid item>
                                <AppPaper title={'Créditos'}>
                                    <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                                        <Grid item>
                                            <TextField
                                                label='Totales'
                                                value={totalTokens}
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
                                                label='Usados'
                                                value={usedTokens}
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
                                                label='Expirados'
                                                value={expiredTokens}
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
                                                label='Disponibles'
                                                value={availablesTokens}
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                variant="standard"
                                                size={'small'}
                                                fullWidth
                                            />
                                        </Grid>

                                    </Grid>
                                </AppPaper>
                            </Grid>
                            <Grid item>
                                <AppPaper title={'Inscribir en taller'}>
                                    <form onSubmit={inscription}>
                                        <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                                            <Grid item>
                                                <Autocomplete
                                                    inputValue={inputInscriptionLessonValue}
                                                    onInputChange={(e, newInputValue) => {
                                                        setinputInscriptionLessonValue(newInputValue);
                                                    }}
                                                    value={inscriptionData.lesson}
                                                    onChange={(e, newValue) => {
                                                        setInscriptionData({ ...inscriptionData, lesson: newValue })
                                                    }}
                                                    disablePortal
                                                    options={lessonsIscriptionOptions}
                                                    renderInput={(params) => <TextField {...params} label='Taller' size={'small'} fullWidth required />}
                                                />
                                            </Grid>
                                            <Grid item textAlign={'right'}>
                                                <Button variant={'contained'} type='submit'>Inscribir</Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </AppPaper>
                            </Grid>
                            <Grid item>
                                <AppPaper title={'Asignar créditos'}>
                                    <form onSubmit={sale}>
                                        <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                                            <Grid item>
                                                <Autocomplete
                                                    inputValue={inputTokenLessonValue}
                                                    onInputChange={(e, newInputValue) => {
                                                        setInputTokenLessonValue(newInputValue);
                                                    }}
                                                    value={saleData.lesson}
                                                    onChange={(e, newValue) => {
                                                        setSaleData({ ...saleData, lesson: newValue })
                                                    }}
                                                    disablePortal
                                                    options={lessonsTokensOptions}
                                                    renderInput={(params) => <TextField {...params} label='Taller' size={'small'} fullWidth required />}
                                                />
                                            </Grid>
                                            <Grid item >
                                                <TextField label="Cantidad"
                                                    value={saleData.quanty}
                                                    onChange={(e) => {
                                                        setSaleData({
                                                            ...saleData,
                                                            quanty: e.target.value
                                                        })
                                                    }}
                                                    variant="outlined"
                                                    type={'number'}
                                                    size={'small'}
                                                    required
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item >
                                                <TextField label="Valor Venta"
                                                    value={saleData.amount}
                                                    onChange={(e) => {
                                                        setSaleData({
                                                            ...saleData,
                                                            amount: e.target.value
                                                        })
                                                    }}
                                                    variant="outlined"
                                                    size={'small'}
                                                    required
                                                    fullWidth
                                                />

                                            </Grid>
                                            <Grid item >
                                                <DesktopDatePicker
                                                    label="Fecha de expiración"
                                                    inputFormat='DD-MM-YYYY'
                                                    value={saleData.expiration}
                                                    onChange={(e) => {
                                                        setSaleData({
                                                            ...saleData,
                                                            expiration: moment(e).format('YYYY-MM-DD')
                                                        })
                                                    }}
                                                    renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
                                                />
                                            </Grid>

                                            <Grid item textAlign={'right'}>
                                                <Button variant={'contained'} onClick={sale} type='submit'>Asignar</Button>
                                            </Grid>

                                        </Grid>
                                    </form>
                                </AppPaper>
                            </Grid>
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

function saleDataDefault() {
    return ({
        quanty: 0,
        amount: 0,
        expiration: new Date,
        lesson: { key: 0, label: '', id: 0 }
    })
}




