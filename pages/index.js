import { React, useEffect } from 'react'
import Layout from '../components/Layout'
import AppPapper from '../components/AppPaper'

import Link from 'next/link'
import { Grid, TextField } from '@mui/material'
import LoginForm from '../components/Forms/LoginForm/LoginForm'
import { useRouter } from 'next/router'

export default function Log(props) {
  const { setPageTitle, setUserName, setUserId, setUser, setProfileName, setProfileAdmin, setProfileDelete, setProfileUpdate } = props
  const router = useRouter()

  useEffect(() => {
    setUserName(router.query.userName)
    setUserId(router.query.userId)
    setUser(router.query.user)
    setProfileName(router.query.profileName)
    setProfileAdmin(router.query.profileAdmin)
    setProfileDelete(router.query.setProfileDelete)
    setProfileUpdate(router.query.setProfileUpdate)
    setPageTitle('')
  }, [])
  return (
    <>
      <Grid container
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ backgroundColor: 'lightgray' }}
        marginLeft={-2}
        marginRight={-2}
        marginTop={'-4.7rem'}
        height={'100vh'}
        width={'100.2vw'}
        alignSelf={'start'}
      >
        <LoginForm />
      </Grid>
    </>
  )
}
