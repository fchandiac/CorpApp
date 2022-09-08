import { React, useState } from 'react'
import AppPaper from '../../AppPaper'
import { Alert, Button, Grid, TextField, Snackbar } from '@mui/material'
import { useRouter } from 'next/router'

const users = require('../../../promises/users')
const records = require('../../../promises/records')


export default function LoginForm() {
    const [userData, setUserData] = useState(userDataDefault())
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const router = useRouter()

    const handleOnChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value
        })
    }

    const handleCloseSnack = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnack(false)
    }



    const submit = (e) => {
        e.preventDefault()
        users.findOneByUser(userData.user)
        .then(res => {
            console.log(res)
            if (res == null) {
                setErrorText('Usuario NO EXISTE')
                setOpenSnack(true)
            } else {
                if (userData.pass == res.pass) {
                    router.push({
                        pathname: '/students',
                        query: {
                            userId: res.id,
                            userName: res.name,
                            user: res.user,
                            profileName: res.Profile.name,
                            profileAdmin: res.Profile.admin,
                            profileDelete: res.Profile.delete,
                            profileUpdate: res.Profile.update
                        }
                    })
                    records.create(
                        'acceso',
                        'ingreso App',
                        res.name,
                        res.id
                    )
                    .catch(err => {console.error(err)})
                } else {
                    setErrorText('Contraseña incorrecta')
                    setOpenSnack(true)
                }
            }
        })
        .catch(err => {
            let errString = err.toString() == 'TypeError: Failed to fetch' ?  'Error de conexión con servidor' : 'Error desconocido'
            setErrorText(errString)
            setOpenSnack(true)
            console.log(err)
        })

    }
    return (
        <>
            <AppPaper title='Acceso App'>
                <form onSubmit={submit}>
                    <Grid container sx={{ p: 2 }}>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField label="Usuario"
                                name="user"
                                value={userData.user}
                                onChange={handleOnChange}
                                variant="outlined"
                                size={'small'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Contraseña"
                                name="pass"
                                value={userData.pass}
                                onChange={handleOnChange}
                                variant="outlined"
                                size={'small'}
                                type={'password'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign='right'>
                            <Button variant={'contained'} type='submit'>login</Button>
                        </Grid>
                    </Grid>
                </form>
            </AppPaper>
            <Snackbar open={openSnack} anchorOrigin={{ vertical: 'top', horizontal: 'right' }} autoHideDuration={4000} onClose={handleCloseSnack}>
                <Alert severity="error" variant={'filled'}>
                    {errorText}
                </Alert>
            </Snackbar>
        </>
    )
}

function userDataDefault() {
    return ({
        user: '',
        pass: '',
    })
}