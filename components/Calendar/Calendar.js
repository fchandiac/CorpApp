import { React, useState, useEffect } from 'react'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import Month from './Month/Month'
import moment from 'moment'
import { Box, Grid, IconButton, Typography } from '@mui/material'
require('dayjs/locale/es')

export default function Calendar(props) {
  const {header} = props
  const [date, setDate] = useState(moment(new Date))
  const [month, setMonth] = useState(moment().month())
  const [year, setYear] = useState(moment().year())

  useEffect(() => {
    setMonth(date.month())
    setYear(date.year())

  }, [date])


  const backwardMonth = () => {
    setDate(moment(date).subtract(1, 'months'))
  }

  const forwardMonth = () => {
    setDate(moment(date).add(1, 'months'))
  }


  return (
    <>
      <Grid container spacing={1} paddingBottom={2}>
        <Grid item xs={9} sm={9} md={9} >
          <Typography>{header}</Typography>
        </Grid>
        <Grid item xs={3} sm={3} md={3} >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={backwardMonth}><ArrowLeftIcon fontSize={'large'} /></IconButton>
            <Typography paddingLeft={1} paddingRight={1} width={'8rem'}>
              {date.format('MMMM YYYY')}
            </Typography>
            <IconButton onClick={forwardMonth}><ArrowRightIcon fontSize={'large'} /></IconButton>
          </Box>
        </Grid>

      </Grid>



      <Month monthArray={getMonth(month, year)} date={date} />
    </>
  )
}


function getMonth(month, year) {
  const firstDayofMonth = moment(new Date(year, month))
  let currentMonthCount = 1 - firstDayofMonth.day()
  const days = new Array(35).fill(null).map(() => {
    currentMonthCount++
    return new Date(year, month, currentMonthCount)
  })
  return days
}