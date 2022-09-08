import { Grid, Typography } from '@mui/material'
import React from 'react'
import Day from '../Day/Day'
import moment from 'moment'


export default function Month(props) {
    const { date, monthArray } = props
    return (
        <>
            <Grid columns={7} container spacing={.1}>
                <Grid item xs={1} sm={1} md={1} textAlign={'center'}>
                    <Typography>
                        Lunes
                    </Typography>
                </Grid>
                <Grid item xs={1} sm={1} md={1} textAlign={'center'}>
                    <Typography>
                        Martes
                    </Typography>
                </Grid>
                <Grid item xs={1} sm={1} md={1} textAlign={'center'}>
                    <Typography>
                        Miércoles
                    </Typography>
                </Grid>
                <Grid item xs={1} sm={1} md={1} textAlign={'center'}>
                    <Typography>
                        Jueves
                    </Typography>
                </Grid>
                <Grid item xs={1} sm={1} md={1} textAlign={'center'}>
                    <Typography>
                        Viernes
                    </Typography>
                </Grid>
                <Grid item xs={1} sm={1} md={1} textAlign={'center'}>
                    <Typography>
                        Sábado
                    </Typography>
                </Grid>
                <Grid item xs={1} sm={1} md={1} textAlign={'center'}>
                    <Typography>
                        Domingo
                    </Typography>
                </Grid>
                {monthArray.map((day) => {
                    var inCurrentMonth = (moment(day).month() == moment(date).month() ? true : false)
                    return (
                        <Grid item xs={1} sm={1} md={1}>
                            <Day day={day} inCurrentMonth={inCurrentMonth}/>
                        </Grid>
                    )
                })}
            </Grid>
        </>

    )
}
