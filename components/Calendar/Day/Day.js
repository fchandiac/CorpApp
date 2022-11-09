import {
    Dialog, Grid, IconButton, Paper, Typography, DialogContent, DialogActions, Button, DialogTitle,
    TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete,
    TableContainer, TableHead, TableRow, TableCell, TableBody
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import moment from 'moment'
import { React, useState, useEffect } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import InfoIcon from '@mui/icons-material/Info'
import ListAltIcon from '@mui/icons-material/ListAlt'
import { TimePicker } from '@mui/x-date-pickers/TimePicker'
import AppErrorSnack from '../../AppErrorSnack'
require('moment/locale/es')
import { useRouter } from 'next/router'


const records = require('../../../promises/records')
const sessions = require('../../../promises/sessions')
const lessons = require('../../../promises/lessons')
const rooms = require('../../../promises/rooms')
const attendances = require('../../../promises/attendances')

function sessionDataDefault() {
    return ({
        date: '',
        start: '',
        end: '',
        lesson: { key: 0, label: '', id: 0 },
        room: { key: 0, label: '', id: 0 }

    })
}

export default function Day(props) {
    const { day, inCurrentMonth } = props
    const router = useRouter()
    const [openDialog, setOpenDialog] = useState(false)
    const [sessionData, setSessionData] = useState(sessionDataDefault())
    const [inputLessonsValue, setInputLessonsValue] = useState('')
    const [lessonsOptions, setLessonsOptions] = useState([])
    const [inputRoomsValue, setInputRoomsValue] = useState('')
    const [roomsOptions, setRoomsOptions] = useState([])
    const date = moment(day).format('YYYY-MM-DD')
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [sessionsList, setSessionsList] = useState([])
    const [updateState, setUpdateState] = useState(false)

    useEffect(() => {
        sessions.findAllByDate(date)
            .then(res => {
                // console.log(res)
                setSessionsList(res)
            })
            .catch(err => { console.error(err) })
    }, [day, updateState])

    useEffect(() => {
        lessons.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    label: item.name,
                    id: item.id
                }))
                setLessonsOptions(data)
            })
            .catch(err => { console.error(err) })
    }, [])

    useEffect(() => {
        rooms.findAll()
            .then(res => {
                let data = res.map(item => ({
                    key: item.id,
                    label: item.name,
                    id: item.id
                }))
                setRoomsOptions(data)
            })
    }, [])




    const submit = (e) => {
        e.preventDefault()
        var beginDateTime = date + ' ' + sessionData.start
        var endDateTime = date + ' ' + sessionData.end
        var beginningTime = moment(beginDateTime, 'YYYY-MM-DD HH:mm')
        var endTimeCompare = moment(endDateTime, 'YYYY-MM-DD HH:mm')
        if (sessionData.start == sessionData.end) {
            setErrorText('La hora de inicio y fin no pueden ser iguales')
            setOpenErrorSnack(true)
        } else if (endTimeCompare.isBefore(beginningTime)) {
            setErrorText('La hora de fin no debe ser menor a la hora de inicio')
            setOpenErrorSnack(true)
        } else {
            sessions.findAllByRoomAndDate(sessionData.room.id, date)
                .then(sessionsOnRoom => {
                    var promisesList = []
                    sessionsOnRoom.forEach(session => {
                        //moment(day).format('DD-MM-YYYY')
                        promisesList.push(
                            PromiseCheckTime(date, session.start, session.end, sessionData.start, sessionData.end, session.Lesson.name, session.Room.name))
                    })
                    console.log(date)
                    Promise.all(promisesList)
                        .then(() => {
                            // console.log(date)
                            sessions.create(
                                sessionData.room.id,
                                sessionData.lesson.id,
                                date,
                                sessionData.start,
                                sessionData.end
                            )
                                .then(() => {
                                    records.create(
                                        'clases',
                                        'crea',
                                        'clase ' + sessionData.lesson.label + ' ' + moment(date).format('DD-MM-YYYY'),
                                        router.query.userId
                                    )
                                        .then(() => {
                                            setUpdateState(updateState ? false : true)
                                            setOpenDialog(false)
                                            setSessionData(sessionDataDefault())
                                        })
                                })
                                .catch(err => { console.error(err) })

                        })
                        .catch(busyRoom => {
                            //console.log(busyRoom)
                            setErrorText('Sala ocupada por taller ' + busyRoom.lesson_name + ', de ' + busyRoom.startTime.slice(0, 5) + ' a ' + busyRoom.endTime.slice(0, 5))
                            setOpenErrorSnack(true)
                        })

                })
            // console.log(sessionData)
        }

    }


    return (
        <>
            <Paper sx={{ ...(inCurrentMonth === false && { background: '#eeeeee' }) }}>

                <Grid spacing={1}>
                    <Grid item>
                        <Typography sx={{ paddingLeft: 2, paddingTop: 1 }} >{moment(day).format('DD')}</Typography>
                    </Grid>
                    <Grid direction="column" spacing={0}>
                        {sessionsList.map(item => (
                            <Grid item>
                                <SessionCard
                                    id={item.id}
                                    lesson={item.Lesson}
                                    room={item.Room}
                                    date={date}
                                    start={item.start}
                                    end={item.end}
                                    index={sessionsList.indexOf(item)}
                                    updateState={updateState}
                                    setUpdateState={setUpdateState}
                                />
                            </Grid>

                        ))}
                    </Grid>
                    <Grid item textAlign={'right'} paddingBottom={.5} paddingRight={.5}>
                        <IconButton onClick={() => { setOpenDialog(true) }}><AddCircleIcon /></IconButton>
                    </Grid>
                </Grid>
            </Paper>
            <Dialog open={openDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Nueva Clase
                </DialogTitle>
                <form onSubmit={submit}>
                    <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                        <Grid container spacing={1} direction="column" sx={{ p: 1 }}>
                            <Grid item>
                                <Autocomplete
                                    inputValue={inputLessonsValue}
                                    onInputChange={(e, newInputValue) => {
                                        setInputLessonsValue(newInputValue);
                                    }}
                                    value={sessionData.lesson}
                                    onChange={(e, newValue) => {
                                        setSessionData({ ...sessionData, lesson: newValue })
                                    }}
                                    disablePortal
                                    options={lessonsOptions}
                                    renderInput={(params) => <TextField {...params} label='Taller' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item>
                                <Autocomplete
                                    inputValue={inputRoomsValue}
                                    onInputChange={(e, newInputValue) => {
                                        setInputRoomsValue(newInputValue);
                                    }}
                                    value={sessionData.room}
                                    onChange={(e, newValue) => {
                                        setSessionData({ ...sessionData, room: newValue })
                                    }}
                                    disablePortal
                                    options={roomsOptions}
                                    renderInput={(params) => <TextField {...params} label='Sala' size={'small'} fullWidth required />}
                                />
                            </Grid>
                            <Grid item>
                                <TextField label="Inicio"
                                    value={sessionData.start}
                                    variant={'outlined'}
                                    type={'time'}
                                    size={'small'}
                                    onChange={(e) => { setSessionData({ ...sessionData, start: e.target.value }) }}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                            </Grid>
                            <Grid item>
                                <TextField label="Fin"
                                    value={sessionData.end}
                                    variant={'outlined'}
                                    type={'time'}
                                    size={'small'}
                                    onChange={(e) => { setSessionData({ ...sessionData, end: e.target.value }) }}
                                    fullWidth
                                    InputLabelProps={{
                                        shrink: true,
                                    }}
                                    required
                                />
                            </Grid>
                        </Grid>
                    </DialogContent>
                    <DialogActions sx={{ paddingRight: 2, paddingBottom: 2 }}>
                        <Button variant={'contained'} type='submit'>Guardar</Button>
                        <Button variant={'outlined'} onClick={() => setOpenDialog(false)} >cerrar</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={errorText} />

        </>

    )
}

function eventDataDefault() {
    return ({
        name: '',
        description: '',
        start: '',
        end: '',
        office: ''
    })
}


function SessionCard(props) {
    const router = useRouter()
    const { id, lesson, room, date, start, end, index, updateState, setUpdateState } = props
    const [openInfoDialog, setOpenInfoDialog] = useState(false)
    const [lessonAttendance, setLessonAttendance] = useState([])
    const [bg, setBg] = useState((index % 2 == 0) ? '#b2ebf2' : '#80deea')

    useEffect(() => {
      attendances.findAllbySession(id)
      .then(res => {
        setLessonAttendance(res)
      })
      .catch(err => {console.error(err)})
    }, [])
    


    const destroy = () => {
        sessions.destroy(id)
            .then(() => {
                records.create(
                    'clases',
                    'elimina',
                    'clase ' + lesson.name + ' ' + moment(date).format('DD-MM-YYYY'),
                    router.query.userId
                )
                    .then(() => {
                        setUpdateState((updateState ? false : true))
                    })
                    .catch(err => { console.error(err) })
            })
            .catch(err => { console.error(err) })
    }
    return (
        <>
            <Grid container sx={{ backgroundColor: bg }}>
                <Grid item xs={8} sm={8} md={8}>
                    <Typography fontSize={15}>
                        {lesson.name}
                    </Typography>
                    <Typography fontSize={11}>
                        {room.name}
                    </Typography>
                    <Typography fontSize={11}>
                        {start.slice(0, 5) + '-' + end.slice(0, 5)}
                    </Typography>
                </Grid>
                <Grid item textAlign={'right'} xs={4} sm={4} md={4}>
                    <IconButton
                        sx={{ ...(router.query.profileDelete == 'false' && { display: 'none' }) }}
                        onClick={destroy}
                    >
                        <DeleteIcon sx={{ fontSize: 16, p: 0 }} />
                    </IconButton>
                    <IconButton onClick={() => { setOpenInfoDialog(true)}} >
                        <ListAltIcon sx={{ fontSize: 18, p: 0 }} />
                    </IconButton>
                </Grid>
            </Grid>
            <Dialog open={openInfoDialog} maxWidth={'sm'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    {'Asistencia ' + lesson.name + ' ' + moment(date).format('DD-MM-YYYY')}
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                <TableContainer component={Paper} sx={{ width: '100%', border: 0 }}>
                    <TableHead>
                        <TableRow >
                            <TableCell sx={{ width: '20%' }}>Rut</TableCell>
                            <TableCell sx={{ width: '40%' }}>Nombre</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            lessonAttendance.map((row) => (
                                <TableRow key={row.id} sx={{ width: '100%', height:'12px' }}>
                                    <TableCell>{row.Student.rut}</TableCell>
                                    <TableCell>{row.Student.name}</TableCell>
                                </TableRow>
                            ))
                        }

                    </TableBody>
                </TableContainer>

                </DialogContent>
                <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    <Button variant={'outlined'} onClick={() => { setOpenInfoDialog(false) }} >cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

function checkTimeTest(date, startTime, endTime, checkTime) {
    date = moment(date).format('YYYY-MM-DD') + ' '
    startTime = moment(date + startTime).subtract(1, 'minute')
    endTime = moment(date + endTime).add(1, 'minute')
    checkTime = moment(date + checkTime)
    return checkTime.isBetween(startTime, endTime)
    // true = is between = cant add
}

function PromiseCheckTime(date, startTime, endTime, checkStartTime, checkEndTime, lesson_name, room_name) {
    const check = new Promise((resolve, reject) => {
        var checkStart = checkTimeTest(date, startTime, endTime, checkStartTime)
        var checkEnd = checkTimeTest(date, startTime, endTime, checkEndTime)

        if (checkStart === true || checkEnd === true) {
            reject({ 'lesson_name': lesson_name, 'room_name': room_name, 'startTime': startTime, 'endTime': endTime })
        } else {
            resolve()
        }
    })
    return check
}