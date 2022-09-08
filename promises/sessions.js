const config = require('../config.json')
const server_url = config.server_url


function create(room_id, lesson_id, date, start, end) {
    let data = {'room_id':room_id, 'lesson_id':lesson_id, 'date':date, 'start':start, 'end':end}
    const session = new Promise((resolve, reject) => {
        fetch(server_url + 'sessions/create', {
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

    return session
}

function findAllByLessonAndDate(lesson_id, date){
    let data = {'lesson_id':lesson_id, 'date':date}
    const sessions = new Promise((resolve, reject) => {
        fetch(server_url + 'sessions/findAllByLessonAndDate', {
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

    return sessions
}

function findAllByRoomAndDate(room_id, date){
    let data = {'room_id':room_id, 'date':date}
    const session = new Promise((resolve, reject) => {
        fetch(server_url + 'sessions/findAllByRoomAndDate', {
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

    return session
}



function findAllByDate(date){
    let data = {'date':date}
    const session = new Promise((resolve, reject) => {
        fetch(server_url + 'sessions/findAllByDate', {
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

    return session
}

function destroy(id) {
    let data = {'id':id}
    const session = new Promise((resolve, reject) => {
        fetch(server_url + 'sessions/destroy', {
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

    return session
}

export {create, findAllByLessonAndDate, findAllByRoomAndDate, destroy, findAllByDate}