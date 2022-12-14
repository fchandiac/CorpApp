import { React, useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import RecordsGrid from '../components/Grids/RecordsGrid/RecordsGrid'

export default function records(props) {
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
        setPageTitle('')
    }, [])
    return (
        <>
            <RecordsGrid />
        </>
    )
}
