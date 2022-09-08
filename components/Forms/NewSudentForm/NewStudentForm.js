import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, Button } from '@mui/material'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import moment from 'moment'
import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import AppErrorSnack from '../../AppErrorSnack'
import AppPaper from '../../AppPaper'

const utils = require('../../../utils')
const students = require('../../../promises/students')
const records = require('../../../promises/records')


export default function NewStudentForm(props) {
    const {updateGrid} = props
    const router = useRouter()
    const [studentData, setStudentData] = useState(stdudentDataDefault())
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [textErrorSnack, setTextErrorSnack] = useState('')

    const submit = (e) => {
        e.preventDefault()
        students.create(
            studentData.rut,
            studentData.name,
            studentData.phone,
            studentData.mail,
            studentData.address,
            studentData.gender,
            studentData.date_of_birth
        )
        .then(()=> {
            records.create(
                'estudiantes',
                'crea',
                'nuevo estudiante ' + studentData.name,
                router.query.userId
            )
            .then(() => {
                setStudentData(stdudentDataDefault())
                updateGrid()
            })
            .catch(err => {console.error(err)})
        })
        .catch(err => {
            console.error(err)
            if (err.errors[0].message == 'rut must be unique') {
                setTextErrorSnack('El rut ingresado ya existe')
                setOpenErrorSnack(true)
            } else if (err.errors[0].message == 'name must be unique'){
                setTextErrorSnack('El nombre ingresado ya existe')
                setOpenErrorSnack(true)
            }
        })
    }

    return (
        <>
            <AppPaper title={'Nuevo Estudiante'}>
                <form onSubmit={submit}>
                    <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                        <Grid item >
                            <TextField label="Rut"
                                value={studentData.rut}
                                onChange={(e) => {
                                    setStudentData({
                                        ...studentData,
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
                                value={studentData.name}
                                onChange={(e) => {
                                    setStudentData({
                                        ...studentData,
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
                                value={studentData.phone}
                                onChange={(e) => {
                                    setStudentData({
                                        ...studentData,
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
                                value={studentData.mail}
                                onChange={(e) => {
                                    setStudentData({
                                        ...studentData,
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
                                value={studentData.address}
                                onChange={(e) => {
                                    setStudentData({
                                        ...studentData,
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
                                    value={studentData.gender}
                                    label="Genero"
                                    name='gender'
                                    onChange={(e) => {
                                        setStudentData({
                                            ...studentData,
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
                        <Grid item>
                            <DesktopDatePicker
                                label="Fecha de Nacimiento"
                                inputFormat='DD-MM-YYYY'
                                value={studentData.date_of_birth}
                                onChange={(e) => {
                                    setStudentData({
                                        ...studentData,
                                        date_of_birth:  moment(e).format('YYYY-MM-DD')
                                    })
                                }}
                                renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
                            />
                        </Grid>
                        <Grid item textAlign={'right'}>
                            <Button variant={'contained'} type='submit'>Guardar</Button>
                        </Grid>

                    </Grid>
                </form>
            </AppPaper>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={textErrorSnack}/>
        </>
    )
}

function stdudentDataDefault() {
    return ({
        rut: '',
        name: '',
        phone: '',
        mail: '',
        address: '',
        gender: '',
        date_of_birth: new Date
    })
}
