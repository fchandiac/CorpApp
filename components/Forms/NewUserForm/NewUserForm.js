import { Grid, TextField, Button, Autocomplete } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppPaper from '../../AppPaper'
import { useRouter } from 'next/router'
import AppErrorSnack from '../../AppErrorSnack'

const users = require('../../../promises/users')
const profiles = require('../../../promises/profiles')
const records = require('../../../promises/records')

export default function NewUserForm(props) {
    const {updateGrid} = props
    const router = useRouter()
    const [userData, setUserData] = useState(userDataDefault())
    const [profilesOptions, setProfilesOptions] = useState([])
    const [inputProfileValue, setInputProfileValue] = useState('')
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [textErrorSnack, setTextErrorSnack] = useState('')

    useEffect(() => {
      profiles.findAll()
      .then(res => {
        let data = res.map(item => ({
            key: item.id,
            label: item.name,
            id: item.id
        }))
        setProfilesOptions(data)
      })
    }, [])
    

    const submit = (e) => {
        e.preventDefault()
        // console.log(userData)
        users.create(
            userData.user,
            userData.pass,
            userData.name,
            userData.profile.id
        )
        .then(()=> {
            records.create(
                'usuarios',
                'crea',
                'usuario ' + userData.name,
                router.query.userId
            )
            .then(()=> {
                setUserData(userDataDefault())
                updateGrid()
            })
            .catch(err => {console.error(err)})
        })
        .catch(err =>{
            if (err.errors[0].message == 'name must be unique') {
                setTextErrorSnack('El nombre de funcionario ingresado ya existe')
                setOpenErrorSnack(true)
            } else if (err.errors[0].message == 'user must be unique'){
                setTextErrorSnack('El nombre de usuario ingresado ya existe')
                setOpenErrorSnack(true)
            }
        })
    }
    return (
        <>
            <AppPaper title='Nuevo Ususario'>
                <form onSubmit={submit}>
                    <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                        <Grid item >
                            <TextField label="Nombre de usuario"
                                name="user"
                                value={userData.user}
                                onChange={(e) => {
                                    setUserData({
                                        ...userData,
                                        user: e.target.value
                                    })
                                }}
                                variant="outlined"
                                size={'small'}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item >
                            <TextField label="Nombre funcionario"
                                name="name"
                                value={userData.name}
                                onChange={(e) => {
                                    setUserData({
                                        ...userData,
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
                            <TextField label="Contraseña"
                                name="pass"
                                value={userData.pass}
                                InputProps={{
                                    readOnly: true,
                                }}
                                variant="outlined"
                                size={'small'}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <Autocomplete
                                inputValue={inputProfileValue}
                                onInputChange={(e, newInputValue) => {
                                    setInputProfileValue(newInputValue);
                                }}
                                value={userData.profile}
                                onChange={(e, newValue) => {
                                    setUserData({ ...userData, profile: newValue })
                                }}
                                disablePortal
                                options={profilesOptions}
                                renderInput={(params) => <TextField {...params} label='Privilegios' size={'small'} fullWidth required />}
                            />
                        </Grid>
                        <Grid item textAlign={'right'}>
                            <Button variant={'contained'} type='submit'>Guardar</Button>
                        </Grid>
                    </Grid>
                </form>
            </AppPaper>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={textErrorSnack}/>
        </>
    )
}


function userDataDefault() {
    return ({
        user: '',
        name: '',
        pass: 1234,
        profile: {key: null, label: '', id: null}
    })
}