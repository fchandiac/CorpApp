import { Grid, TextField, Button, FormControlLabel, Switch} from '@mui/material'
import { React, useState } from 'react'
import AppPaper from '../../AppPaper'
import { useRouter } from 'next/router'

const profiles = require('../../../promises/profiles')
const records = require('../../../promises/records')

export default function NewProfileForm(props) {
    const {updateGrid} = props
    const router = useRouter()
    const [profileData, setProfileData] = useState(profileDataDefault())


    const submit = (e) => {
        e.preventDefault()
        profiles.create(
            profileData.name,
            profileData.admin,
            profileData.delete,
            profileData.update
        )
        .then(()=> {
            records.create(
                'privilegios',
                'crea',
                'privilegio ' + profileData.name,
                router.query.userId
            )
            .then(() => {
                setProfileData(profileDataDefault())
                updateGrid()
            })
        })
        .catch(err => {
            console.log(err)
        })
        
    }

    return (
        <>
            <AppPaper title='Nuevo Privilegio'>
                <form onSubmit={submit}>
                    <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                        <Grid item>
                            <TextField label="Nombre"
                                value={profileData.name}
                                onChange={(e) => {
                                    setProfileData({
                                        ...profileData,
                                        name: e.target.value
                                    })
                                }}
                                variant="outlined"
                                size={'small'}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                control=
                                {<Switch
                                    checked={profileData.admin}
                                    onChange={(e) => {
                                        setProfileData({
                                            ...profileData,
                                            admin: e.target.checked
                                        })
                                    }}
                                />} label="Admnistración" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                control=
                                {<Switch
                                    checked={profileData.delete}
                                    onChange={(e) => {
                                        setProfileData({
                                            ...profileData,
                                            delete: e.target.checked
                                        })
                                    }}
                                />} label="Eliminar" />
                        </Grid>
                        <Grid item>
                            <FormControlLabel
                                control=
                                {<Switch
                                    checked={profileData.update}
                                    onChange={(e) => {
                                        setProfileData({
                                            ...profileData,
                                            update: e.target.checked
                                        })
                                    }}
                                />} label="Actualizar" />
                        </Grid>
                        <Grid item textAlign={'right'}>
                            <Button variant={'contained'} type='submit'>Guardar</Button>
                        </Grid>
                    </Grid>
                </form>
            </AppPaper>
        </>
    )
}

function profileDataDefault() {
    return ({
        name: '',
        admin: false,
        delete: false,
        update: false
    })
}
