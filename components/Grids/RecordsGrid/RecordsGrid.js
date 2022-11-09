import moment from 'moment'
import {React, useState, useEffect} from 'react'
import AppDataGrid from '../../AppDataGrid/AppDataGrid'

const records = require('../../../promises/records')

export default function RecordsGrid() {
    const [recordsList, setRecordsList] = useState([])
    const [gridApiRef, setGridApiRef] = useState(null)

    useEffect(() => {
      records.findAll()
      .then(res => {
        let data = res.map(item => ({
            id: item.id,
            table: item.table,
            action: item.action,
            description: item.description,
            userName: (item.User == null ? 'sin dato': item.User.name),
            createdAt: moment(item.createdAt).format('DD-MM-YYYY HH:mm:ss')
        }))
        setRecordsList(data)
      })
      .catch(err => {console.error(err)})
    }, [])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'table', headerName: 'Registro', flex: .8 },
        { field: 'action', headerName: 'Acción', flex: .8 },
        { field: 'description', headerName: 'Descripción', flex: 1.5 },
        { field: 'userName', headerName: 'funcionario', flex: 1 },
        { field: 'createdAt', headerName: 'Fecha', flex: 1, type: 'date' },
        

    ]
    
  return (
    <>
    <AppDataGrid rows={recordsList} columns={columns} title={'Registros'} height='84vh' setGridApiRef={setGridApiRef}/>
    </>
  )
}
