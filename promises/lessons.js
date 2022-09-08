const config = require('../config.json')
const server_url = config.server_url

function findAll(){
    const lessons = new Promise((resolve, reject) => {
        fetch(server_url + 'lessons/findAll', {
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
    return lessons
}

function destroy(id){
    let data = {'id':id}
    const lesson = new Promise((resolve, reject) => {
        fetch(server_url + 'lessons/destroy', {
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
    return lesson
}

function create(name, teacher_id, quota){
    let data = {'name':name, 'teacher_id':teacher_id, 'quota':quota}
    const lesson = new Promise((resolve, reject) => {
        fetch(server_url + 'lessons/create', {
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
    return lesson
}

function update(id, name, teacher_id, quota){
    let data = {'id':id, 'name':name, 'teacher_id':teacher_id, 'quota':quota}
    const lesson = new Promise((resolve, reject) => {
        fetch(server_url + 'lessons/update', {
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
    return lesson
}


export {findAll, destroy, create, update}