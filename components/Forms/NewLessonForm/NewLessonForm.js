import { Grid, TextField, Button, Autocomplete } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppPaper from '../../AppPaper'
import { useRouter } from 'next/router'
import AppErrorSnack from '../../AppErrorSnack'

const records = require('../../../promises/records')
const lessons = require('../../../promises/lessons')
const teachers = require('../../../promises/teachers')

export default function NewLessonForm(props) {
    const { updateGrid } = props
    const router = useRouter()
    const [inputTeacherValue, setInputTeacherValue] = useState('')
    const [teachersOptions, setTeachersOptions] = useState([])
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [textErrorSnack, setTextErrorSnack] = useState('')
    const [lessonData, setLessonData] = useState(lessonDataDefault())

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

    const submit = (e) => {
        e.preventDefault()
        lessons.create(
            lessonData.name,
            lessonData.teacher.id,
            lessonData.quota
        )
        .then(()=> {
            records.create(
                'talleres',
                'crea',
                'taller ' + lessonData.name,
                router.query.userId
            )
            .then(() => {
                setLessonData(lessonDataDefault())
                updateGrid()
            })
            .catch(err => { console.error(err )})
        })
        .catch(err => {
            console.error(err)
            if (err.errors[0].message == 'name must be unique'){
                setTextErrorSnack('El nombre ingresado ya existe')
                setOpenErrorSnack(true)
            }
        })
    }

    return (
        <>
            <AppPaper title='Nuevo Taller'>
                <form onSubmit={submit}>
                    <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                        <Grid item >
                            <TextField label="Nombre"
                                value={lessonData.name}
                                onChange={(e) => {
                                    setLessonData({
                                        ...lessonData,
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
                                value={lessonData.quota}
                                type={'number'}
                                onChange={(e)=>{
                                    setLessonData({
                                        ...lessonData, quota: e.target.value
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
                                value={lessonData.teacher}
                                onChange={(e, newValue) => {
                                    setLessonData({ ...lessonData, teacher: newValue })
                                }}
                                disablePortal
                                options={teachersOptions}
                                renderInput={(params) => <TextField {...params} label='Profesor' size={'small'} fullWidth required />}
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

function lessonDataDefault() {
    return ({
        name: '',
        quota: 0,
        teacher: { key: 0, label: '', id: 0 }
    })
}