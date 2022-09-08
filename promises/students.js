
const config = require('../config.json')
const server_url = config.server_url

function create(rut, name, phone, mail, address, gender, date_of_birth) {
    let data = { 'rut': rut, 'name': name, 'phone': phone, 'mail': mail, 'address': address, 'gender': gender, 'date_of_birth': date_of_birth}
    const student = new Promise((resolve, reject) => {
        fetch(server_url + 'students/create', {
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
        }).catch(err => {
            reject(err)
            console.log(err)
        })
    })

    return student
}

function findAll(){
    const students = new Promise((resolve, reject) => {
        fetch(server_url + 'students/findAll', {
            method: 'GET',
            body: JSON.stringify(),
            headers: { 'Content-Type': 'application/json'}
        }).then(res => {
            //console.log(config.password)
            res.json().then(res => {
                if (res.code === 0) {
                    reject(res.data)
                } else {
                    resolve(res.data)
                }
            })
        }).catch(err => {console.log(err)})
    })
    return students
}
function destroy(id) {
    let data = {'id':id}
    const student = new Promise((resolve, reject) => {
        fetch(server_url + 'students/destroy', {
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
        }).catch(err => {console.log(err)})
    })

    return student
}

function findOnebyId(id) {
    let data = {'id':id}
    const student = new Promise((resolve, reject) => {
        fetch(server_url + 'students/findOnebyId', {
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
        }).catch(err => {console.log(err)})
    })

    return student
}

function update(id, rut, name, phone, mail, address, gender, date_of_birth) {
    let data = { 'id':id, 'rut': rut, 'name': name, 'phone': phone, 'mail': mail, 'address': address, 'gender': gender, 'date_of_birth': date_of_birth}
    const student = new Promise((resolve, reject) => {
        fetch(server_url + 'students/update', {
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
        }).catch(err => {console.log(err)})
    })

    return student
}
export {create, findAll, destroy, findOnebyId, update}