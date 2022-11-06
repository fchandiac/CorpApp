import { React, useState, useEffect } from 'react'
import '../styles/global.css'
import { LocalizationProvider, esES as esESPick } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import bgLocale from 'date-fns/locale/bg'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { esES as coreEs } from '@mui/material/locale'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'
import moment from 'moment'

const tokens = require('../promises/tokens')


const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' }
    },
  }, coreEs)

// { palette: { primary: { main: '#1976d2' }, }, }

// { palette: { 
//   primary: { main: '#ef5350' },
//   secondary: {main: '#616161'}
// }



export default function MyApp({ Component, pageProps }) {
  const [pageTitle, setPageTitle] = useState('')
  const [userName, setUserName] = useState('')
  const [userId, setUserId] = useState(undefined)
  const [user, setUser] = useState('')
  const [profileName, setProfileName] = useState('')
  const [profileAdmin, setProfileAdmin] = useState('')
  const [profileDelete, setProfileDelete] = useState('')
  const [profileUpdate, setProfileUpdate] = useState('')

  useEffect(() => {
    tokens.updateStateByExpiration()
    .catch(err => {console.error(err)})
  }, [])
  



  //userName={userName} userId={userId} user={user} profileName={profileName} logState={logState}
  const loc = moment.locale('en',
    {
      months : 'enero_febrero_marzo_abril_mayo_junio_julio_agosto_septiembre_octubre_noviembre_diciembre'.split('_'),
      weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
      weekdaysShort: 'dom._lun._mar._mie._jue._vie._sab.'.split('_')
    })
 

  return (

    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterMoment}>
        <Layout pageTitle={pageTitle} userName={userName} userId={userId} user={user} profileName={profileName} profileAdmin={profileAdmin} profileDelete={profileDelete} profileUpdate={profileUpdate}>
          <Component
            {...pageProps}
            setPageTitle={setPageTitle}
            setUserName={setUserName}
            setUserId={setUserId}
            setUser={setUser}
            setProfileName={setProfileName}
            setProfileAdmin={setProfileAdmin}
            setProfileDelete={setProfileDelete}
            setProfileUpdate={setProfileUpdate}

          />
        </Layout>
      </LocalizationProvider>
    </ThemeProvider>


  )
}
