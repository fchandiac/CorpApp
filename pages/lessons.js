import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Grid } from '@mui/material'
import LessonsTab from '../components/Tabs/LessonsTab'
import NewTeacherForm from '../components/Forms/NewTeacherForm/NewTeacherForm'
import TeachersGrid from '../components/Grids/TeachersGrid/TeachersGrid'
import NewRoomForm from '../components/Forms/NewRoomForm/NewRoomForm'
import RoomsGrid from '../components/Grids/RoomsGrid/RoomsGrid'
import NewLessonForm from '../components/Forms/NewLessonForm/NewLessonForm'
import LessonsGrid from '../components/Grids/LessonsGrid/LessonsGrid'

export default function lessons(props) {
    const { setPageTitle, setUserName, setUserId, setUser, setProfileName, setProfileAdmin, setProfileDelete, setProfileUpdate } = props
    const router = useRouter()

    useEffect(() => {
        setUserName(router.query.userName)
        setUserId(router.query.userId)
        setUser(router.query.user)
        setProfileName(router.query.profileName)
        setProfileAdmin(router.query.profileAdmin)
        setProfileDelete(router.query.profileDelete)
        setProfileUpdate(router.query.profileUpdate)
        setPageTitle('Talleres')
    }, [])
    return (
        <>
            <LessonsTab lessonsContent={LessonsContent()} teachersContent={TeachersContent()} roomsContents={RoomsContents()} />
        </>
    )
}

function LessonsContent() {
    const [lessonsGridState, setLessonsGridState] = useState(false)
    const updateGrid = () => {
        let gridState = lessonsGridState == false ? true : false
        setLessonsGridState(gridState)
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={4} sm={4} md={4}>
               <NewLessonForm updateGrid={updateGrid} />
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
               <LessonsGrid updateState={lessonsGridState} />
            </Grid>
        </Grid>
    )
}

function TeachersContent() {
    const [teachersGridState, setTeachersGridState] = useState(false)
    const updateGrid = () => {
        let gridState = teachersGridState == false ? true : false
        setTeachersGridState(gridState)
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={4} sm={4} md={4}>
                <NewTeacherForm updateGrid={updateGrid}/>
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
                <TeachersGrid updateState={teachersGridState}/>
            </Grid>
        </Grid>
    )
}

function RoomsContents() {
    const [roomsGridState, setRoomsGridState] = useState(false)
    const updateGrid = () => {
        let gridState = roomsGridState == false ? true : false
        setRoomsGridState(gridState)
    }
    return (
        <Grid container spacing={1}>
            <Grid item xs={4} sm={4} md={4}>
                <NewRoomForm updateGrid={updateGrid} />
            </Grid>
            <Grid item xs={8} sm={8} md={8}>
                <RoomsGrid updateState={roomsGridState} />
            </Grid>
        </Grid>
    )
}