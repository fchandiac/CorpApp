import { React, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import AppPaper from '../components/AppPaper'
import { Grid, TextField } from '@mui/material'
import UpdatePassForm from '../components/Forms/UpdatePassForm'

const users = require('../promises/users')

export default function myProfile(props) {
  const { setPageTitle, setUserName, setUserId, setUser, setProfileName, setProfileAdmin, setProfileDelete, setProfileUpdate } = props
  const router = useRouter()
  const [userData, setUserData] = useState(UserDataDefault())
  const [pass, setPass] = useState('')

  useEffect(() => {
    setUserName(router.query.userName)
    setUserId(router.query.userId)
    setUser(router.query.user)
    setProfileName(router.query.profileName)
    setProfileAdmin(router.query.profileAdmin)
    setProfileDelete(router.query.profileDelete)
    setProfileUpdate(router.query.profileUpdate)
    setPageTitle('Mi Perfil')
  }, [])

  useEffect(() => {
    users.findOneById(router.query.userId)
      .then(res => {
        setUserData({
          ...userData,
          user: res.user,
          name: res.name,
          profileName: res.Profile.name
        })
        setPass(res.pass)
      })
      .catch(err => console.error(err))
  }, [])




  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={4} sm={4} md={4}>
          <AppPaper title='Mis datos de perfil'>
            <Grid container sx={{ p: 2 }} spacing={1} direction="column">
              <Grid item>
                <TextField
                  label='Nombre de usuario'
                  value={userData.user}
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
                  label='Nombre funcionario'
                  value={userData.name}
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
                  label='Privilegios'
                  value={userData.profileName}
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
        <Grid item xs={4} sm={4} md={4}>
          <UpdatePassForm userId={router.query.userId} pass={pass} />
        </Grid>
      </Grid>


    </>
  )
}


function UserDataDefault() {
  return ({
    user: '',
    name: '',
    profileName: ''
  })
}
