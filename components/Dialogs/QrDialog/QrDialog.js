import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Grid, Typography } from '@mui/material'
import { React, useState, useEffect } from 'react'
import QRCode from 'react-qr-code'
import PhoneIcon from '@mui/icons-material/Phone'
import MailIcon from '@mui/icons-material/Mail'
import download from 'downloadjs'
import * as htmlToImage from 'html-to-image'

export default function QrDialog(props) {
    const { openDialog, setOpenDialog, rut, name } = props
    const [rutStr, setRutStr] = useState('')

    //RUN¡23050962'K

    useEffect(() => {
         
        var rutStr = rut != undefined? rut.toString(): ''
        rutStr = rutStr.replace('.', '')
        rutStr = rutStr.replace('.', '')
        var formatRutStr = 'RUN=' + rutStr
        setRutStr(formatRutStr)
    }, [openDialog])

    const closeDialog = () => {
        setOpenDialog(false)
    }

    const downloadImg = () => {
        //var img = document.getElementById('img-qr')
        var imgName = name + '.jpeg'
        htmlToImage.toJpeg(document.getElementById('img-qr'))
            .then(function (dataUrl) {
                download(dataUrl, imgName);
            });
    }

    return (
        <>
            <Dialog open={openDialog} maxWidth={'xs'} fullWidth>
                <DialogTitle sx={{ paddingLeft: 2, paddingRight: 2 }}>
                    Cédigo Qr
                </DialogTitle>
                <DialogContent sx={{ paddingLeft: 1, paddingRight: 1 }}>
                    <Grid spacing={2} direction={'column'} textAlign={'center'} id='img-qr' sx={{backgroundColor: '#fafafa'}}>
                        <Typography>
                            Código Qr de acceso
                        </Typography>
                        <Typography paddingTop={2}>
                            {name + ' - rut: ' + rut}
                        </Typography>
                        <QRCode value={rutStr} title={name} />
                        <Typography paddingTop={2}>
                            073(2)463460<PhoneIcon />
                        </Typography>
                        <Typography>
                            corporacióndeportesparral@gmail.com<MailIcon />
                        </Typography>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button variant={'contained'} onClick={downloadImg}>descargar</Button>
                    <Button variant={'outlined'} onClick={closeDialog} >cerrar</Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
