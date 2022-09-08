
const config = require('../config.json')
const server_url = config.server_url



function create(rut, name, phone, mail, address) {
    let data = { 'rut': rut, 'name': name, 'phone': phone, 'mail': mail, 'address': address }
    const teacher = new Promise((resolve, reject) => {
        fetch(server_url + 'teachers/create', {
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
        }).catch(err => { console.log(err) })
    })

    return teacher
}

function findAll() {
    const teachers = new Promise((resolve, reject) => {
        fetch(server_url + 'teachers/findAll', {
            method: 'GET',
            body: JSON.stringify(),
            headers: { 'Content-Type': 'application/json' }
        }).then(res => {
            //console.log(config.password)
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => { console.log(err) })
    })
    return teachers
}

function destroy(id) {
    let data = { 'id':id}
    const teacher = new Promise((resolve, reject) => {
        fetch(server_url + 'teachers/destroy', {
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
        }).catch(err => { console.log(err) })
    })

    return teacher
}

function update(id, rut, name, phone, mail, address) {
    let data = { 'id':id, 'rut': rut, 'name': name, 'phone': phone, 'mail': mail, 'address': address }
    const teacher = new Promise((resolve, reject) => {
        fetch(server_url + 'teachers/update', {
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
        }).catch(err => { console.log(err) })
    })

    return teacher
}


export { create, findAll, destroy, update }