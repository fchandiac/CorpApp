const config = require('../config.json')
const server_url = config.server_url

function create(name, admin, del, update) {
    let data = {'name':name, 'admin':admin, 'delete': del, 'update':update}
    const profile = new Promise((resolve, reject) => {
        fetch(server_url + 'profiles/create', {
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
        }).catch(err => {reject(err)})
    })
    return profile
}

function findAll() {
    const profile = new Promise((resolve, reject) => {
        fetch(server_url + 'profiles/findAll', {
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
        }).catch(err => {reject(err)})
    })
    return profile
}

function update(id, name, admin, del, update) {
    let data = {'id':id, 'name':name, 'admin':admin, 'delete': del, 'update':update}
    const profile = new Promise((resolve, reject) => {
        fetch(server_url + 'profiles/update', {
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
        }).catch(err => {reject(err)})
    })
    return profile
}

function destroy(id) {
    let data = {'id':id}
    const profile = new Promise((resolve, reject) => {
        fetch(server_url + 'profiles/destroy', {
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
        }).catch(err => {reject(err)})
    })
    return profile
}


export {findAll, create, update, destroy}