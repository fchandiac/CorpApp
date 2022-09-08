import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import UsersTab from '../components/Tabs/UsersTab'
import NewUserForm from '../components/Forms/NewUserForm/NewUserForm'
import { Grid } from '@mui/material'
import UsersGrid from '../components/Grids/usersGrid/UsersGrid'
import NewProfileForm from '../components/Forms/NewProfileForm/NewProfileForm'
import ProfilesGrid from '../components/Grids/ProfilesGrid/ProfilesGrid'

export default function users(props) {
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
        setPageTitle('Usuarios')
    }, [])
    return (
        <>
            <UsersTab usersContent={UsersContent()} profilesContent={ProfilesContent()} />
        </>
    )
}

function UsersContent() {
    const [usersGridState, setUsersGridState] = useState(false)
    const updateGrid = () => {
        let gridState = usersGridState == false ? true : false
        setUsersGridState(gridState)
    }
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={4} sm={4} md={4}>
                    <NewUserForm updateGrid={updateGrid}/>
                </Grid>
                <Grid item xs={8} sm={8} md={8}>
                    <UsersGrid updateState={usersGridState}/>
                </Grid>
            </Grid>
        </>
    )
}

function ProfilesContent() {
    const [profilesGridstate, setProfilesGridstate] = useState(false)

    const updateGrid = () => {
        let gridState = profilesGridstate == false ? true : false
        setProfilesGridstate(gridState)
    }
    return (
        <>
            <Grid container spacing={1}>
                <Grid item xs={4} sm={4} md={4}>
                    <NewProfileForm updateGrid={updateGrid}/>
                </Grid>
                <Grid item xs={8} sm={8} md={8}>
                    <ProfilesGrid updateState={profilesGridstate}/>
                </Grid>
            </Grid>

        </>
    )
}