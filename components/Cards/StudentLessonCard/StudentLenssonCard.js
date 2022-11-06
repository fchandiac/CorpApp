import { Card, CardActionArea, CardContent, CardHeader, Typography } from '@mui/material'
import { React, useEffect, useState } from 'react'

const tokens = require('../../../promises/tokens')

export default function StudentLenssonCard(props) {
  const { lessonId, lessonName, studentId } = props
  const [availableTokens, setAvailableTokens] = useState(0)

  useEffect(() => {
    tokens.findAllAvailablesByStudentAndLesson(studentId, lessonId)
      .then(res => { setAvailableTokens(res.length) })
      .catch(err => { console.error(err) })
  }, [])


  return (
    <>
      <Card sx={{ background: '#f5f5f5' }}>
        <CardContent>
          <Typography fontSize={18}>
            {lessonName}
          </Typography>
          <Typography fontSize={12}>
            {availableTokens + ' créditos'}
          </Typography>
        </CardContent>
      </Card>
    </>
  )
}
