import {
  AppBar, Container, Grid, IconButton, Typography, Box, Divider, Drawer, List,
  ListItem, ListItemButton, ListItemText, Popper, TextField, Button
} from '@mui/material'
import MenuIcon from '@mui/icons-material/Menu'
import AccountCircle from '@mui/icons-material/AccountCircle'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'


import AppPaper from '../AppPaper'

export default function Layout(props) {
  const { children, pageTitle, userName, userId, user, profileName, profileAdmin, profileDelete, profileUpdate } = props
  const router = useRouter()
  const [drawerState, setDrawerState] = useState(false)
  const [popperAnchorEl, setpopperAnchorEl] = useState(null)
  const [popperOpen, setPopperOpen] = useState(false)
  const [log, setLog] = useState('')
  const id = 'simple-popper'

  console.log(router.query.userId)

  useEffect(() => {
    
    if (userId == '') {
      setLog('')
      router.push({
        pathname: '/',
        query: {
          userId: undefined,
          user: undefined,
          userName: undefined,
          profileName: undefined,
          profileName: undefined,
          profileDelete: undefined,
          profileAdmin: undefined,
          profileUpdate: undefined
        }
      })
    } else if (userId == undefined){
      setLog('')
    } else {
      setLog(userId)
    }
  }, [userId])




  return (
    <>
      <AppBar sx={{ ...( log == '' && { display: 'none' }) }}>
        <Container sx={{ display: 'flex', alignItems: 'center', paddingTop: '0.3rem', paddingBottom: '0.3rem' }}>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => { setDrawerState(true) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {pageTitle}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h8" component="div" sx={{ flexGrow: 1, marginRight: '1rem' }}>
              {userName}
            </Typography>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={(e) => {
                setpopperAnchorEl(popperAnchorEl ? null : e.currentTarget)
                setPopperOpen(popperOpen ? false : true)
              }}
              aria-describedby={id}
            >
              <AccountCircle />
            </IconButton>
            <Popper id={id} open={popperOpen} anchorEl={popperAnchorEl}>
              <Grid sx={{ marginRight: 2, marginTop: 3 }}>
                <AppPaper title=''>
                  <Grid item xs={12} sm={12} md={12} paddingLeft={2} paddingRight={2}>
                    <TextField
                      label='Nombre de usuario'
                      value={user}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} paddingTop={1} paddingLeft={2} paddingRight={2}>
                    <TextField
                      label='Privilegios'
                      value={profileName}
                      InputProps={{
                        readOnly: true,
                      }}
                      variant="standard"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign='right' paddingBottom={2} paddingRight={2}>
                    <ListItemButton onClick={(e) => {
                      setpopperAnchorEl(popperAnchorEl ? null : e.currentTarget,)
                      setPopperOpen(false),
                        router.push({
                          pathname: '/myProfile',
                          query: {
                            userId: userId,
                            user: user,
                            userName: userName,
                            profileName: profileName,
                          }
                        })
                    }}>
                      <ListItemText primary="Mi perfil" />
                    </ListItemButton>
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} paddingTop={1} textAlign='right' paddingBottom={2}>
                    <ListItemButton onClick={(e) => {
                      setpopperAnchorEl(popperAnchorEl ? null : e.currentTarget,)
                      setPopperOpen(false),
                        router.push({
                          pathname: '/',
                          query: {
                            userId: undefined,
                            user: undefined,
                            userName: undefined,
                            profileName: undefined,
                            profileName: undefined,
                            profileDelete: undefined,
                            profileAdmin: undefined,
                            profileUpdate: undefined
                          }
                        })
                    }}>
                      <ListItemText primary="cerrar sesión" />

                    </ListItemButton>
                  </Grid>
                </AppPaper>
              </Grid>
            </Popper>
          </Box>
        </Container>
      </AppBar>
      <Drawer
        anchor='left'
        open={drawerState}
      >
        <Box sx={{ justifyContent: 'flex-end', display: 'flex', padding: '0.3rem' }}>
          <IconButton onClick={() => setDrawerState(false)} >
            <ChevronLeft />
          </IconButton>
        </Box>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Estudiantes"
                onClick={() => {
                  router.push({
                    pathname: '/students',
                    query: {
                      userId: userId,
                      user: user,
                      userName: userName,
                      profileName: profileName,
                      profileAdmin: profileAdmin,
                      profileDelete: profileDelete,
                      profileUpdate: profileUpdate
                    }
                  })
                  setDrawerState(false)
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Talleres"
                onClick={() => {
                  router.push({
                    pathname: '/lessons',
                    query: {
                      userId: userId,
                      user: user,
                      userName: userName,
                      profileName: profileName,
                      profileAdmin: profileAdmin,
                      profileDelete: profileDelete,
                      profileUpdate: profileUpdate
                    }
                  })
                  setDrawerState(false)
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Calendario"
                onClick={() => {
                  router.push({
                    pathname: '/calendar',
                    query: {
                      userId: userId,
                      user: user,
                      userName: userName,
                      profileName: profileName,
                      profileAdmin: profileAdmin,
                      profileDelete: profileDelete,
                      profileUpdate: profileUpdate
                    }
                  })
                  setDrawerState(false)
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Usuarios"
                onClick={() => {
                  router.push({
                    pathname: '/users',
                    query: {
                      userId: userId,
                      user: user,
                      userName: userName,
                      profileName: profileName,
                      profileAdmin: profileAdmin,
                      profileDelete: profileDelete,
                      profileUpdate: profileUpdate

                    }
                  })
                  setDrawerState(false)
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Registros"
                onClick={() => {
                  router.push({
                    pathname: '/records',
                    query: {
                      userId: userId,
                      user: user,
                      userName: userName,
                      profileName: profileName,
                      profileAdmin: profileAdmin,
                      profileDelete: profileDelete,
                      profileUpdate: profileUpdate
                    }
                  })
                  setDrawerState(false)
                }}
              />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText
                primary="Configuración"
                onClick={() => {
                  router.push({
                    pathname: '/config',
                    query: {
                      userId: userId,
                      user: user,
                      userName: userName,
                      profileName: profileName,
                      profileAdmin: profileAdmin,
                      profileDelete: profileDelete,
                      profileUpdate: profileUpdate
                    }
                  })
                  setDrawerState(false)
                }}
              />
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <Box>
        {children}
      </Box>
    </>

  )
}



