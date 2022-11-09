import { React, useState, useEffect, useRef } from 'react'
import DeleteIcon from '@mui/icons-material/Delete'
import { useRouter } from 'next/router'
import AppDataGrid from '../../AppDataGrid'
import { GridActionsCellItem } from '@mui/x-data-grid'
import { Dialog, DialogActions, DialogContent, DialogTitle, Grid, TextField, Button, Typography } from '@mui/material'
import moment from 'moment'

const sales = require('../../../promises/sales')
const utils = require('../../../utils')
const records = require('../../../promises/records')
const tokens = require('../../../promises/tokens')

export default function SalesListGrid() {
  const router = useRouter()
  const [gridApiRef, setGridApiRef] = useState(null)
  const [rowData, setRowData] = useState({})
  const [salesList, setSalesList] = useState([])
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)


  useEffect(() => {
    sales.findAll()
      .then(res => {
        let data = res.map(item => ({
          id: item.id,
          rut: (item.Student == null ? '' : item.Student.rut),
          name: (item.Student == null ? '' : item.Student.name),
          lesson: (item.Lesson == null ? '' : item.Lesson.name),
          quanty: item.quanty,
          amount: item.amount,
          createdAt: moment(item.createdAt).format('DD-MM-YYYY HH:mm')

        }))
        setSalesList(data)
      })
      .catch(err => { console.error(err) })
  }, [])

  const columns = [
    { field: 'id', headerName: 'Id', flex: .5, type: 'number' },
    { field: 'rut', headerName: 'RUT', flex: .8 },
    { field: 'name', headerName: 'Nombre', flex: 1.8 },
    { field: 'lesson', headerName: 'Taller', flex: 1 },
    { field: 'quanty', headerName: 'Tokens', flex: .8, type: 'number' },
    { field: 'amount', headerName: 'Monto', flex: .8, valueFormatter: (params) => (utils.renderMoneystr(params.value)) },
    { field: 'createdAt', headerName: 'Fecha', flex: 1.2, type: 'date' },
    {
      field: 'actions',
      headerName: '',
      type: 'actions', flex: .8, getActions: (params) => [
        <GridActionsCellItem
          sx={{ ...(router.query.profileDelete == 'false' && { display: 'none' }) }}
          label='delete'
          icon={<DeleteIcon />}
          onClick={() => {
            setRowData({
              rowId: params.id,
              id: params.row.id,
              name: params.row.name,
              lesson: params.row.lesson

            }), setOpenDeleteDialog(true)
          }}
        />
      ]
    }
  ]

  const destroy = () => {
    tokens.findAllBySale(rowData.id)
      .then(res => {
        let promiseList = []
        res.map(item => {
          promiseList.push(tokens.destroy(item.id))
        })
        Promise.all(promiseList)
          .then(() => {
            sales.destroy(rowData.id)
              .then(() => {
                records.create(
                  'ventas',
                  'elimina',
                  'venta ' + rowData.id + ' de ' + rowData.name,
                  router.query.userId
                )
                  .then(() => {
                    gridApiRef.current.updateRows([{ id: rowData.rowId, _action: 'delete' }])
                    setOpenDeleteDialog(false)
                  })
                  .catch(err => { console.error(err) })
              })
              .catch(err => { console.error(err) })

          })
          .catch(err => { console.error(err) })
      })
      .catch(err => { console.error(err) })

  }



  return (
    <>
      <AppDataGrid rows={salesList} columns={columns} title={'Ventas'} height='78vh' setGridApiRef={setGridApiRef} />

      <Dialog open={openDeleteDialog} maxWidth={'sm'} fullWidth>
        <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
          Eliminar venta
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
                label='Estudiante'
                value={rowData.name}
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
                label='Taller'
                value={rowData.lesson}
                InputProps={{
                  readOnly: true,
                }}
                variant="standard"
                size={'small'}
                fullWidth
              />
            </Grid>
            <Grid item>
              <Typography>
                (*) al eliminar esta venta, eliminara todos sus créditos asociados.
              </Typography>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <Button variant={'contained'} onClick={destroy} >Eliminar</Button>
          <Button variant={'outlined'} onClick={() => { setOpenDeleteDialog(false) }} >cerrar</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
