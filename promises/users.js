
const config = require('../config.json')
const server_url = config.server_url

function create(user, pass, name, profile_id) {
    let data = { 'user': user, 'pass': pass, 'name': name, 'profile_id': profile_id }
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/create', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })

    return _user
}


function findOneByUser(user) {
    let data = { 'user': user }
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/findOneByUser', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return _user
}


function findAll() {
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/findAll', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })

    return _user
}

function findOneById(id) {
    let data = { 'id': id }
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/findOneById', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return _user
}

function destroy(id) {
    let data = { 'id': id }
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/destroy', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return _user
}

function updatePass(id, pass) {
    let data = { 'id': id, 'pass': pass }
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/updatePass', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return _user
}

function updateProfile(id, profile_id) {
    let data = { 'id': id, 'profile_id': profile_id }
    const _user = new Promise((resolve, reject) => {
        fetch(server_url + 'users/updateProfile', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { reject(err) })
    })
    return _user
}



export { findOneByUser, create, findAll, findOneById, destroy, updatePass, updateProfile }