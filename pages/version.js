import { Typography } from '@mui/material'
import {React, useEffect} from 'react'
import { useRouter } from 'next/router'

export default function version(props) {
  const { setPageTitle, setUserName, setUserId, setUser, setProfileName, setProfileAdmin, setProfileDelete, setProfileUpdate } = props
  const router = useRouter()

  useEffect(() => {
    setUserName(router.query.userName)
    setUserId(router.query.userId)
    setUser(router.query.user)
    setProfileName(router.query.profileName)
    setProfileAdmin(router.query.profileAdmin)
    setProfileDelete(router.query.profileDelete)
    setProfileUpdate(router.query.profileUpdate)
    setPageTitle('Info Versión')
  }, [])

 
  return (
    <>
      <Typography fontSize={16}>
        2.1.1: noviembre 08 2022
      </Typography>
      <Typography fontSize={12}>
        - Correción carga registros en user null.
      </Typography>
      <Typography fontSize={12}>
        - Correción resgistro de usuario en venta de crédito.
      </Typography>
      <Typography fontSize={12}>
        - DataGrid ventas.
      </Typography>
      <Typography fontSize={12}>
        - DataGrid créditos.
      </Typography>
      <Typography fontSize={12}>
        - Icono Qr renderiza independiente del privilegio.
      </Typography>
      <Typography fontSize={12}>
        - Icono Delete se asocia a privilegio delete.
      </Typography>
      <Typography fontSize={12}>
        - Actualización AppDataGrid.
      </Typography>
      <Typography fontSize={12}>
        - Se añade page version.
      </Typography>
      <Typography fontSize={16}>
        2.1.0 noviembre 07 2022
      </Typography>
      <Typography fontSize={12}>
        - Se repara calendario, incluyen funcionalidades de imprensión lista de taller.
      </Typography>
      <Typography fontSize={16}>
        2.0.0 septiembre 2022
      </Typography>
      <Typography fontSize={12}>
        - Nueva versión aplicación.
      </Typography>
    </>
  )
}
