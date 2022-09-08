import { Paper, Typography } from '@mui/material'
import React from 'react'


export default function AppPaper(props) {
  const { children, title } = props
  return (
    <Paper elevation={0} variant="outlined" >
      <Typography sx={{ paddingLeft: 2, paddingTop: 2 }} >{title}</Typography>
      {children}
    </Paper>
  )
}
