import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Grid } from '@mui/material'
import NewSudentForm from '../components/Forms/NewSudentForm'
import StudentsGrid from '../components/Grids/StudentsGrid/StudentsGrid'

export default function Students(props) {
    const { setPageTitle, setUserName, setUserId, setUser, setProfileName, setProfileAdmin, setProfileDelete, setProfileUpdate } = props
    const router = useRouter()
    const [studentsGridState, setStudentsGridState] = useState(false)
    

    useEffect(() => {
        setUserName(router.query.userName)
        setUserId(router.query.userId)
        setUser(router.query.user)
        setProfileName(router.query.profileName)
        setProfileAdmin(router.query.profileAdmin)
        setProfileDelete(router.query.profileDelete)
        setProfileUpdate(router.query.profileUpdate)
        setPageTitle('Estudiantes')
    }, [])

    const updateGrid = () => {
        let gridState = studentsGridState == false ? true : false
        setStudentsGridState(gridState)
    }

    return (
        <>

            <Grid container spacing={1}>
                <Grid item xs={4} sm={4} md={4}>
                    <NewSudentForm updateGrid={updateGrid}/>
                </Grid>
                <Grid item xs={8} sm={8} md={8}>
                    <StudentsGrid updateState={studentsGridState}/>
                </Grid>
            </Grid>
        </>
    )
}
