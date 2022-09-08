
const config = require('../config.json')
const server_url = config.server_url



function create(table, action, description, user_id) {
    let data = { 'table': table, 'action': action, 'description': description, 'user_id': user_id }
    const record = new Promise((resolve, reject) => {
        fetch(server_url + 'records/create', {
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

    return record
}

function findAll() {
    const record = new Promise((resolve, reject) => {
        fetch(server_url + 'records/findAll', {
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

    return record
}


export { create, findAll }