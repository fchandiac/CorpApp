import { React, useState, useEffect } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import InfoIcon from '@mui/icons-material/Info'
import AppDataGrid from '../../AppDataGrid/AppDataGrid'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { useRouter } from 'next/router'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, Autocomplete } from '@mui/material'
import AppErrorSnack from '../../AppErrorSnack'

const records = require('../../../promises/records')
const teachers = require('../../../promises/teachers')
const utils = require('../../../utils')

export default function TeachersGrid(props) {
  const { updateState } = props
  const router = useRouter()
  const [gridApiRef, setGridApiRef] = useState(null)
  const [rowData, setRowData] = useState({})
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openInfoDialog, setOpenInfoDialog] = useState(false)
  const [teachersList, setTeachersList] = useState([])
  const [openErrorSnack, setOpenErrorSnack] = useState(false)
  const [textErrorSnack, setTextErrorSnack] = useState('')

  useEffect(() => {
    teachers.findAll()
      .then(res => {
        let data = res.map(item => ({
          id: item.id,
          rut: item.rut,
          name: item.name,
          phone: item.phone,
          mail: item.mail,
          address: item.address,
        }))
        setTeachersList(data)
      })
      .catch(err => { console.error(err) })
  }, [updateState])

  const columns = [
    { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
    { field: 'rut', headerName: 'Rut', flex: .8 },
    { field: 'name', headerName: 'Nombre', flex: 2 },
    { field: 'phone', headerName: 'Teléfono', flex: 1 },
    { field: 'mail', headerName: 'Mail', flex: 1, hide: true },
    { field: 'address', headerName: 'Dirección', flex: 1, hide: true },
    {
      field: 'actions',
      headerName: '',
      type: 'actions', flex: .5, getActions: (params) => [
        <GridActionsCellItem
          sx={{ ...(router.query.profileDelete == 'false' && { display: 'none' }) }}
          label='delete'
          icon={<DeleteIcon />}
          onClick={() => {
            setRowData({
              rowId: params.id,
              id: params.row.id,
              name: params.row.name,

            }), setOpenDeleteDialog(true)
          }}
        />,
        <GridActionsCellItem
          sx={{ ...(router.query.profileUpdate == 'false' && { display: 'none' }) }}
          label='info'
          icon={<InfoIcon />}
          onClick={() => {
            setRowData({
              rowId: params.id,
              id: params.row.id,
              rut: params.row.rut,
              name: params.row.name,
              phone: params.row.phone,
              mail: params.row.mail,
              address: params.row.address
            }), setOpenInfoDialog(true)
          }}
        />

      ]
    }
  ]

  const update = (e) => {
    e.preventDefault()
    teachers.update(rowData.id, rowData.rut, rowData.name, rowData.phone, rowData.mail)
      .then(() => {
        records.create(
          'profesores',
          'actualiza',
          'profesor: ' + rowData.id,
          router.query.userId
        )
          .then(() => {
            gridApiRef.current.updateRows([{
              id: rowData.rowId,
              rut: rowData.rut,
              name: rowData.name,
              phone: rowData.phone,
              mail: rowData.mail
            }])
            setOpenInfoDialog(false)
          })
          .catch(err => { console.error(err) })
      })
      .catch(err => {
        console.error(err)
        if (err.errors[0].message == 'name must be unique') {
          setTextErrorSnack('El nombre ingresado ya existe')
          setOpenErrorSnack(true)
        }
      })
  }

  const destroy = () => {
    teachers.destroy(rowData.id)
      .then(() => {
        records.create(
          'profesores',
          'elimina',
          'profesor: ' + rowData.name,
          router.query.userId
        )
          .then(() => {
            gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
            setOpenDeleteDialog(false)
          })
          .catch(err => { console.error(err) })
      })
      .catch(err => { console.error(err) })
  }

  return (
    <>
      <AppDataGrid rows={teachersList} columns={columns} title={'Profesores'} height='78vh' setGridApiRef={setGridApiRef} />

      <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
        <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Eliminar Profesor
        </DialogTitle>
        <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
          <Grid container sx={{ p: 1 }} spacing={1} direction="column">
            <Grid item>
              <TextField
                label='Id'
                value={rowData.id}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <TextField
                label='Nombre'
                value={rowData.name}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                size={'small'}
                fullWidth
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button variant={'contained'} onClick={destroy} >Eliminar</Button>
          <Button variant={'outlined'} onClick={() => { setOpenDeleteDialog(false) }} >cerrar</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openInfoDialog} maxWidth={'xs'} fullWidth>
        <form onSubmit={update}>
          <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
            {'Información del Profesor'}
          </DialogTitle>
          <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
            <Grid container spacing={0} sx={{ p: 1 }} direction="column">
              <Grid item >
                <TextField label="Rut"
                  value={rowData.rut}
                  onChange={(e) => {
                    setRowData({
                      ...rowData,
                      rut: utils.formatRut(e.target.value)
                    })
                  }}
                  variant="outlined"
                  size={'small'}
                  required
                  fullWidth
                />
              </Grid>
              <Grid item >
                <TextField label="Nombre"
                  value={rowData.name}
                  onChange={(e) => {
                    setRowData({
                      ...rowData,
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
                <TextField label="Teléfono"
                  value={rowData.phone}
                  onChange={(e) => {
                    setRowData({
                      ...rowData,
                      phone: e.target.value
                    })
                  }}
                  variant="outlined"
                  size={'small'}
                  fullWidth
                />
              </Grid>
              <Grid item >
                <TextField label="Mail"
                  value={rowData.mail}
                  onChange={(e) => {
                    setRowData({
                      ...rowData,
                      mail: e.target.value
                    })
                  }}
                  variant="outlined"
                  size={'small'}
                  fullWidth
                />
              </Grid>
              <Grid item >
                <TextField label="Dirección"
                  value={rowData.address}
                  onChange={(e) => {
                    setRowData({
                      ...rowData,
                      address: e.target.value
                    })
                  }}
                  variant="outlined"
                  size={'small'}
                  fullWidth
                />
              </Grid>

            </Grid>
          </DialogContent>
          <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
            <Button type='submit' variant={'contained'}>Actualizar</Button>
            <Button variant={'outlined'} onClick={() => { setOpenInfoDialog(false) }} >cerrar</Button>
          </DialogActions>
        </form>
      </Dialog>
      <AppErrorSnack openSnack={openErrorSnack} setOpenSnack={setOpenErrorSnack} errorText={textErrorSnack} />
    </>
  )
}
