import { React, useState, useEffect } from 'react'
import '../styles/global.css'
import { LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { esES } from '@mui/material/locale'
import Layout from '../components/Layout'
import { useRouter } from 'next/router'

const theme = createTheme(
  {
    palette: {
      primary: { main: '#1976d2' }
    },
  }, esES)

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



  //userName={userName} userId={userId} user={user} profileName={profileName} logState={logState}


  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <ThemeProvider theme={theme}>
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
      </ThemeProvider>
    </LocalizationProvider>

  )
}
