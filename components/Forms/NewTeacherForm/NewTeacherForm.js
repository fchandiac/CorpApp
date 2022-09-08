import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Grid, TextField, Button } from '@mui/material'
import AppPaper from '../../AppPaper'
import AppErrorSnack from '../../AppErrorSnack'

const utils = require('../../../utils')
const teachers = require('../../../promises/teachers')
const records = require('../../../promises/records')


export default function NewTeacherForm(props) {
    const { updateGrid } = props
    const router = useRouter()
    const [teacherData, setTeacherData] = useState(teacherDataDefault())
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [textErrorSnack, setTextErrorSnack] = useState('')

    const submit = (e) => {
        e.preventDefault()
        teachers.create(
            teacherData.rut,
            teacherData.name,
            teacherData.phone,
            teacherData.mail,
            teacherData.address
        )
            .then(() => {
                records.create(
                    'profesores',
                    'crea',
                    'profesor ' + teacherData.name,
                    router.query.userId
                )
                .then(() => {
                    setTeacherData(teacherDataDefault())
                    updateGrid()
                })
                .catch(err => {console.error(err)})

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
            <AppPaper title={'Nuevo profesor'}>
                <form onSubmit={submit}>
                    <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                        <Grid item >
                            <TextField label="Rut"
                                value={teacherData.rut}
                                onChange={(e) => {
                                    setTeacherData({
                                        ...teacherData,
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
                                value={teacherData.name}
                                onChange={(e) => {
                                    setTeacherData({
                                        ...teacherData,
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
                                value={teacherData.phone}
                                onChange={(e) => {
                                    setTeacherData({
                                        ...teacherData,
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
                                value={teacherData.mail}
                                onChange={(e) => {
                                    setTeacherData({
                                        ...teacherData,
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
                                value={teacherData.address}
                                onChange={(e) => {
                                    setTeacherData({
                                        ...teacherData,
                                        address: e.target.value
                                    })
                                }}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                            />
                        </Grid>
                        <Grid item textAlign={'right'}>
                            <Button variant={'contained'} type='submit'>Guardar</Button>
                        </Grid>

                    </Grid>
                </form>
            </AppPaper>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={textErrorSnack} />
        </>
    )
}

function teacherDataDefault() {
    return ({
        rut: '',
        name: '',
        phone: '',
        mail: '',
        address: ''
    })
}
