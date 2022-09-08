import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { Grid, TextField, Button } from '@mui/material'
import AppPaper from '../../AppPaper'
import AppErrorSnack from '../../AppErrorSnack'

const records = require('../../../promises/records')
const rooms = require('../../../promises/rooms')

export default function NewRoomForm(props) {
    const { updateGrid } = props
    const router = useRouter()
    const [openErrorSnack, setOpenErrorSnack] = useState(false)
    const [textErrorSnack, setTextErrorSnack] = useState('')
    const [roomData, setRoomData] = useState(roomDataDefault())

    const submit = (e) => {
        e.preventDefault()
        rooms.create(
            roomData.name
        )
        .then(()=> {
            records.create(
                'salas',
                'crea',
                'sala ' + roomData.name,
                router.query.userId
            )
            .then(()=> {
                setRoomData(roomDataDefault())
                updateGrid()
            })
            .catch(err => {console.error(err)})
        })
        .catch(err => {
            console.error(err)
            if (err.errors[0].message == 'name must be unique') {
                setTextErrorSnack('El nombre ingresado ya existe')
                setOpenErrorSnack(true)
            }
        })
    }

  return (
    <>
     <AppPaper title={'Nueva sala'}>
                <form onSubmit={submit}>
                    <Grid container spacing={0} sx={{ p: 1 }} direction="column">
                     
                        <Grid item >
                            <TextField label="Nombre"
                                value={roomData.name}
                                onChange={(e) => {
                                    setRoomData({
                                        ...roomData,
                                        name: e.target.value
                                    })
                                }}
                                variant="outlined"
                                size={'small'}
                                required
                                fullWidth
                            />
                        </Grid>
                        <Grid item textAlign={'right'}>
                            <Button variant={'contained'} type='submit'>Guardar</Button>
                        </Grid>

                    </Grid>
                </form>
            </AppPaper>
            <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={textErrorSnack} />
    </>
  )
}

function roomDataDefault(){
    return({
        name:''
    })
}