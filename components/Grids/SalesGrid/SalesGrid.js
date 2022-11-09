import {React, useState, useEffect } from 'react'
import AppDataGrid from '../../AppDataGrid'
const utils = require('../../../utils')


export default function SalesGrid(props) {
    const {reportData, title} = props
    const [gridApiRef, setGridApiRef] = useState(null)
    const [rowData, setRowData] = useState({})
    const [salesDataList, setsalesDataList] = useState([])

    useEffect(() => {
      var data = reportData.map((item, index) => ({
        id: index,
        rut: item.rut,
        name: item.name,
        tokens: item.total_quanty,
        totalAmount: item.total_amount
      }))
      setsalesDataList(data)

    }, [reportData])

    const columns = [
        { field: 'id', headerName: 'Id', flex: .5, type: 'number', hide: true },
        { field: 'rut', headerName: 'Rut', flex: .6 },
        { field: 'name', headerName: 'Nombre', flex: 1.5 },
        { field: 'tokens', headerName: 'Créditos', flex: .8, type: 'number' },
        { field: 'totalAmount', headerName: 'Total ventas', flex: .8, type: 'number', valueFormatter: (params) => (utils.renderMoneystr(params.value))}
    ]
    
  return (
    <>
    <AppDataGrid rows={salesDataList} columns={columns} title={title} height='78vh' setGridApiRef={setGridApiRef}/>
    </>
  )
}
