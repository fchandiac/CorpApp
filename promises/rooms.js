const config = require('../config.json')
const server_url = config.server_url


function create(name){
    let data = {'name':name}
    const room = new Promise((resolve, reject) => {
        fetch(server_url + 'rooms/create', {
            method: 'POST',
            body: JSON.stringify(data),
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

    return room

}

function findAll(){
    const rooms = new Promise((resolve, reject) => {
        fetch(server_url + 'rooms/findAll', {
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
    return rooms
}

function destroy(id){
    let data = {'id':id}
    const room = new Promise((resolve, reject) => {
        fetch(server_url + 'rooms/destroy', {
            method: 'POST',
            body: JSON.stringify(data),
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
    return room
}

function update(id, name){
    let data = {'id':id, 'name':name}
    const room = new Promise((resolve, reject) => {
        fetch(server_url + 'rooms/update', {
            method: 'POST',
            body: JSON.stringify(data),
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
    return room
}


export {create, findAll, destroy, update}