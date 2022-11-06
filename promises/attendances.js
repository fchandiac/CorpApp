const config = require('../config.json')
const server_url = config.server_url

function create(lesson_id, student_id, session_id, token_id) {
    let data = { 'lesson_id': lesson_id, 'student_id': student_id, 'session_id': session_id, 'token_id': token_id }
    const attendance = new Promise((resolve, reject) => {
        fetch(server_url + 'attendances/create', {
            method: 'POST',
            body: JSON.stringify(data),
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
        }).catch(err => { reject(err) })
    })
    return attendance
}

function findOnebySessionAndStudent(session_id, student_id) {
    let data = { 'session_id': session_id, 'student_id': student_id }
    const attendance = new Promise((resolve, reject) => {
        fetch(server_url + 'attendances/findOnebySessionAndStudent', {
            method: 'POST',
            body: JSON.stringify(data),
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
        }).catch(err => { reject(err) })
    })
    return attendance
}


function findAllbySession(session_id) {
    let data = { 'session_id': session_id}
    const attendance = new Promise((resolve, reject) => {
        fetch(server_url + 'attendances/findAllbySession', {
            method: 'POST',
            body: JSON.stringify(data),
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
        }).catch(err => { reject(err) })
    })
    return attendance
}





export { create, findOnebySessionAndStudent, findAllbySession }

