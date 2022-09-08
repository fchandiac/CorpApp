import { Grid, TextField, Button } from '@mui/material'
import {React, useState} from 'react'
import AppErrorSnack from '../../AppErrorSnack/AppErrorSnack'
import AppPaper from '../../AppPaper'
import { useRouter } from 'next/router'

const users = require('../../../promises/users')
const records = require('../../../promises/records')

export default function UpdatePassForm(props) {
    const { userId, pass } = props
    const router = useRouter()
    const [openSnack, setOpenSnack] = useState(false)
    const [errorText, setErrorText] = useState('')
    const [passData, setPassData] = useState(passDataDefault())

    const handleOnChange = (e) => {
        setPassData({
          ...passData,
          [e.target.name]: e.target.value
        })
      }

    const submit = (e) => {
        e.preventDefault()
        if (pass != passData.pass) {
            setErrorText('Contraseña actual incorrecta')
            setOpenSnack(true)
        } else if (passData.pass != passData.confrimPass) {
            setErrorText('Contraseñas actual y confirmación no coinciden')
            setOpenSnack(true)
        } else {

            users.updatePass(
                userId,
                passData.newPass
            )
            .then(()=> {
                records.create(
                    'usuarios',
                    'actualiza',
                    'funcionario ' + router.query.userName + ' cambia contraseña',
                    userId
                )
                .then(()=> {
                    router.push({
                        pathname: '/',
                        query: {
                          userId: '',
                          user: '',
                          userName: '',
                          profileName: '',
                          profileDelete: '',
                          profileAdmin: '',
                          profileUpdate: ''
                        }
                      })
                })
                .catch(err => {console.error(err)})
            })
            .catch(err => {console.error(err)})
            
            // updatePass(profileData.id, passData.newPass)
            //     .then(() => {
            //         router.push({
            //             pathname: '/'
            //         })
            //     })
            //     .catch(err => { console.log(err) })
        }
    }
    return (
        <>
            <AppPaper>
                <form onSubmit={submit}>
                    <Grid container sx={{ p: 2 }}>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField label="Contraseña actual"
                                name="pass"
                                value={passData.pass}
                                onChange={handleOnChange}
                                variant="outlined"
                                size={'small'}
                                type={'password'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Confirmar contraseña"
                                name="confrimPass"
                                value={passData.confrimPass}
                                onChange={handleOnChange}
                                variant="outlined"
                                size={'small'}
                                type={'password'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1}>
                            <TextField label="Nueva contraseña"
                                name="newPass"
                                value={passData.newPass}
                                onChange={handleOnChange}
                                variant="outlined"
                                size={'small'}
                                type={'password'}
                                fullWidth
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign='right'>
                            <Button variant={'contained'} type='submit'>Actualizar</Button>
                        </Grid>
                    </Grid>
                </form>
                <AppErrorSnack openSnack={openSnack} setOpenSnack={setOpenSnack} errorText={errorText} />
            </AppPaper>

        </>
    )
}

function passDataDefault() {
    return ({
        pass: '',
        confrimPass: '',
        newPass: ''
    })
}
