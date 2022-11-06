import { Grid, Autocomplete, TextField, Button } from '@mui/material'
import { React, useState, useEffect } from 'react'
import AppPaper from '../components/AppPaper'
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'
import moment from 'moment'
import AppErrorSnack from '../components/AppErrorSnack'
import SalesGrid from '../components/Grids/SalesGrid/SalesGrid'

const lessons = require('../promises/lessons')
const salesPr = require('../promises/sales')

export default function sales() {
  const [reportData, setReportData] = useState([])
  const [configData, setConfigData] = useState(configDataDefault())
  const [titleGrid, setTitleGrid] = useState('Ventas')


  useEffect(() => {
    if(configData.lesson.label== ''){
      setTitleGrid('Ventas')
    } else {
      setTitleGrid(configData.lesson.label + ' ' + moment(configData.start).format('DD-MM-YYYY') + ' al ' + moment(configData.end).format('DD-MM-YYYY'))
    }
  }, [reportData])
  

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={4} sm={4} md={4}>
          <ConfigGridForm setReportData={setReportData} configData={configData} setConfigData={setConfigData}/>
        </Grid>
        <Grid item xs={8} sm={8} md={8}>
          <SalesGrid reportData={reportData} title={titleGrid}/>
        </Grid>
      </Grid>
    </>
  )
}


function configDataDefault() {
  return ({
    start: new Date(),
    end: new Date(),
    lesson: { key: 0, label: '', id: 0 },
  })
}

function ConfigGridForm(props) {
  const {setReportData, configData, setConfigData} = props
  const [inputLessonsValue, setInputLessonsValue] = useState('')
  const [lessonsOptions, setLessonsOptions] = useState([])
  
  const [errorText, setErrorText] = useState('')
  const [openErrorSnack, setOpenErrorSnack] = useState(false)

  useEffect(() => {
    lessons.findAll()
      .then(res => {
        let data = res.map(item => ({
          key: item.id,
          label: item.name,
          id: item.id
        }))
        setLessonsOptions(data)
      })
      .catch(err => { console.error(err) })
  }, [])
  const submit = (e) => {
    e.preventDefault()
    if(checkDates(configData.start, configData.end) == true){
      setErrorText('La fecha de inicio no puede ser posterior a la de fin')
      setOpenErrorSnack(true)
    } else {
      salesPr.findAllByLessonAndBetweenExpirationGroupByStudent(
        configData.lesson.id,
        configData.start,
        configData.end
      )
      .then(res => {
        setReportData(res)
      })
      .catch(err => {console.error(err)})
    }
  }
  return (
    <>
      <AppPaper title={'Configuración reporte'}>
        <form onSubmit={submit}>
          <Grid contariner spacing={1} direction={'column'} padding={1}>
            <Grid item>
              <Autocomplete
                inputValue={inputLessonsValue}
                onInputChange={(e, newInputValue) => {
                  setInputLessonsValue(newInputValue);
                }}
                value={configData.lesson}
                onChange={(e, newValue) => {
                  setConfigData({ ...configData, lesson: newValue })
                }}
                disablePortal
                options={lessonsOptions}
                renderInput={(params) => <TextField {...params} label='Taller' size={'small'} fullWidth required />}
              />
            </Grid>
            <Grid item >
              <DesktopDatePicker
                label="Inicio"
                inputFormat='DD-MM-YYYY'
                value={configData.start}
                onChange={(e) => {
                  setConfigData({
                    ...configData,
                    start: moment(e).format('YYYY-MM-DD')
                  })
                }}
                renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
              />
            </Grid>
            <Grid item >
              <DesktopDatePicker
                label="Fin"
                inputFormat='DD-MM-YYYY'
                value={configData.end}
                onChange={(e) => {
                  setConfigData({
                    ...configData,
                    end: moment(e).format('YYYY-MM-DD')
                  })
                }}
                renderInput={(params) => <TextField {...params} size={'small'} fullWidth />}
              />
            </Grid>
            <Grid item textAlign={'right'}>
              <Button variant={'contained'} type='submit'>Generar Reporte</Button>
            </Grid>
          </Grid>
        </form>
      </AppPaper>
      <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={errorText} />
    </>
  )
}

function checkDates(start, end){
  var startDate = moment(start)
  var endDate = moment(end)
  var result = endDate.isBefore(startDate, 'date')
  
  return result
}