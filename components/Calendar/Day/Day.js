import {
    Dialog, Grid, IconButton, Paper, Typography, DialogContent,
    DialogActions, Button, DialogTitle, TextField, Autocomplete
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import moment from 'moment'
import { React, useState, useEffect } from 'react'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import AppErrorSnack from '../../AppErrorSnack'
import { useRouter } from 'next/router'
// require('moment/locale/es')

const lessons = require('../../../promises/lessons')
const rooms = require('../../../promises/rooms')
const sessions = require('../../../promises/sessions')
const records = require('../../../promises/records')

export default function Day(props) {
    const { day, inCurrentMonth } = props
    const [openDialog, setOpenDialog] = useState(false)
    const [updateState, setUpdateState] = useState(false)
    const [sessionsList, setSessionsList] = useState([])
    // console.log(day)

    useEffect(() => {
        sessions.findAllByDate(moment(day).format('YYYY-MM-DD'))
            .then(res => {
                setSessionsList(res)
            })
            .catch(err => { console.error(err) })
    }, [day, updateState])


    return (
        <>
            <Paper sx={{ ...(inCurrentMonth === false && { background: '#eeeeee' }) }}>

                <Grid direction="column">
                    <Grid item>
                        <Typography sx={{ paddingLeft: .1, paddingTop: 1 }} >{moment(day).format('DD')}</Typography>
                    </Grid>
                    <Grid direction="column" spacing={0}>
                        {
                            sessionsList.map(session => (
                                <SessionCard
                                    id={session.id}
                                    date={session.date}
                                    start={session.start}
                                    end={session.end}
                                    lesson={session.Lesson}
                                    room={session.Room}
                                    index={sessionsList.indexOf(session)}
                                    updateState={updateState}
                                    setUpdateState={setUpdateState}
                                />
                            ))
                        }
                    </Grid>
                    <Grid item textAlign={'right'} paddingBottom={.5} paddingRight={.5}>
                        <IconButton onClick={() => { setOpenDialog(true) }}><AddCircleIcon /></IconButton>
                    </Grid>
                </Grid>
            </Paper>
            <NewSessionDialog openDialog={openDialog} setOpenDialog={setOpenDialog} day={day} updateState={updateState} setUpdateState={setUpdateState} />
        </>

    )
}

function SessionCard(props) {
    const { id, date, start, end, lesson, room, index, updateState, setUpdateState } = props
    const router = useRouter()
    const [bg, setBg] = useState((index % 2 == 0) ? '#b2ebf2' : '#80deea')


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
                    setUpdateState(updateState ? false : true)
                })
                .catch(err => {console.error(err)})
                
            })
            .catch(err => { console.error(err) })
    }

    return (
        <Grid container sx={{ backgroundColor: bg }}>
            <Grid item xs={8} sm={8} md={8}>
                <Typography fontSize={15}>
                    {lesson.name}
                </Typography>
                <Typography fontSize={11}>
                    {start.slice(0, 5) + '-' + end.slice(0, 5)}
                </Typography>
                <Typography fontSize={11}>
                    {room.name}
                </Typography>
            </Grid>
            <Grid item textAlign={'right'} xs={4} sm={4} md={4}>
                <IconButton
                    sx={{ ...(router.query.profileDelete == 'false' && { display: 'none' }) }}
                    onClick={destroy}
                >
                    <DeleteIcon sx={{ fontSize: 16, p: 0 }} />
                </IconButton>
                {/* <IconButton >
                    <InfoIcon sx={{ fontSize: 18, p: 0 }} />
                </IconButton> */}
            </Grid>
        </Grid>


    )
}

function NewSessionDialog(props) {
    const { openDialog, setOpenDialog, day, updateState, setUpdateState } = props
    const router = useRouter()
    const [sessionData, setSessionData] = useState(sessionDataDefault())
    const [inputLessonsValue, setInputLessonsValue] = useState('')
    const [lessonsOptions, setLessonsOptions] = useState([])
    const [inputRoomsValue, setInputRoomsValue] = useState('')
    const [roomsOptions, setRoomsOptions] = useState([])
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [textErrorSnack, setTextErrorSnack] = useState('')

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

    useEffect(() => {
        setSessionData({
            ...sessionData,
            date: moment(day).format('YYYY-MM-DD')
        })
    }, [day])

    const closeDialog = () => {
        setOpenDialog(false)
        setSessionData(sessionDataDefault())
    }

    const submit = (e) => {
        e.preventDefault()
        var beginDateTime = sessionData.date + ' ' + sessionData.start
        var endDateTime = sessionData.date + ' ' + sessionData.end
        var beginningTime = moment(beginDateTime, 'YYYY-MM-DD HH:mm')
        var endTimeCompare = moment(endDateTime, 'YYYY-MM-DD HH:mm')
        if (sessionData.start == sessionData.end) {
            setTextErrorSnack('La hora de inicio y fin no pueden ser iguales')
            setOpenErrorSnack(true)
        } else if (endTimeCompare.isBefore(beginningTime)) {
            setTextErrorSnack('La hora de fin no debe ser menor a la hora de inicio')
            setOpenErrorSnack(true)
        } else {
            sessions.findAllByRoomAndDate(sessionData.room.id, sessionData.date)
                .then(sessionsOnRoom => {
                    var promisesList = []
                    sessionsOnRoom.forEach(session => {
                        promisesList.push(
                            PromiseCheckTime(sessionData.date, session.start, session.end, sessionData.start, sessionData.end, session.Lesson.name, session.Room.name))
                    })
                    console.log(sessionData.date)
                    Promise.all(promisesList)
                        .then(() => {
                            console.log(sessionData.date)
                            sessions.create(
                                sessionData.room.id,
                                sessionData.lesson.id,
                                sessionData.date,
                                sessionData.start,
                                sessionData.end
                            )
                                .then(() => {
                                    records.create(
                                        'clases',
                                        'crea',
                                        'clase ' + sessionData.lesson.label + ' ' + moment(sessionData.date).format('DD-MM-YYYY'),
                                        router.query.userId
                                    )
                                        .then(() => {
                                            setUpdateState(updateState ? false : true)
                                            closeDialog()
                                        })
                                })
                                .catch(err => { console.error(err) })

                        })
                        .catch(busyRoom => {
                            console.log(busyRoom)
                            setTextErrorSnack('Sala ocupada por taller ' + busyRoom.lesson_name + ', de ' + busyRoom.startTime.slice(0, 5) + ' a ' + busyRoom.endTime.slice(0, 5))
                            setOpenErrorSnack(true)
                        })

                })
            // console.log(sessionData)
        }

    }


    return (
        <>
            <Dialog open={openDialog} maxWidth={'sm'} fullWidth>
                <form onSubmit={submit}>
                    <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                        {'Nueva Clase ' + moment(day).format('DD-MM-YYYY')}
                    </DialogTitle>
                    <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>

                        <Grid container sx={{ p: 1 }} spacing={1} direction="column">
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
                        <Button variant={'outlined'} onClick={closeDialog} >cerrar</Button>
                    </DialogActions>
                </form>
            </Dialog>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={textErrorSnack} />
        </>
    )
}



function sessionDataDefault() {
    return ({
        date: '',
        start: '',
        end: '',
        lesson: { key: 0, label: '', id: 0 },
        room: { key: 0, label: '', id: 0 }

    })
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