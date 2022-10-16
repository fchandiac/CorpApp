
const config = require('../config.json')
const server_url = config.server_url



function create(lesson_id, student_id, sale_id, expiration) {
    let data = { 'lesson_id': lesson_id, 'student_id': student_id, 'sale_id':sale_id, 'expiration': expiration }
    const token = new Promise((resolve, reject) => {
        fetch(server_url + 'tokens/create', {
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

    return token
}



function findAllByStudent(student_id) {
    let data = { 'student_id': student_id}
    const token = new Promise((resolve, reject) => {
        fetch(server_url + 'tokens/findAllByStudent', {
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

    return token
}




function findAll() {
    const token = new Promise((resolve, reject) => {
        fetch(server_url + 'tokens/findAll', {
            method: 'GET',
            body: JSON.stringify(),
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

    return token
}

function destroy(id) {
    let data = { 'id': id}
    const token = new Promise((resolve, reject) => {
        fetch(server_url + 'tokens/destroy', {
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
    return token
}



function findAllAvailablesByStudentAndLesson(student_id, lesson_id) {
    let data = { 'student_id': student_id, 'lesson_id':lesson_id}
    const token = new Promise((resolve, reject) => {
        fetch(server_url + 'tokens/findAllAvailablesByStudentAndLesson', {
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

    return token
}

function findAllUsedByStudent(student_id) {
    let data = { 'student_id': student_id}
    const token = new Promise((resolve, reject) => {
        fetch(server_url + 'tokens/findAllUsedByStudent', {
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

    return token
}

function findAllAvailablesByStudent(student_id) {
    let data = { 'student_id': student_id}
    const token = new Promise((resolve, reject) => {
        fetch(server_url + 'tokens/findAllAvailablesByStudent', {
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

    return token
}

function findAllExpiredByStudent(student_id) {
    let data = { 'student_id': student_id}
    const token = new Promise((resolve, reject) => {
        fetch(server_url + 'tokens/findAllExpiredByStudent', {
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

    return token
}


function updateStateByExpiration() {
    const token = new Promise((resolve, reject) => {
        fetch(server_url + 'tokens/updateStateByExpiration', {
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
        }).catch(err => { console.log(err) })
    })

    return token
}



export { 
    create, 
    findAllByStudent, 
    findAll , 
    destroy, 
    findAllAvailablesByStudentAndLesson,
    findAllUsedByStudent,
    findAllAvailablesByStudent,
    findAllExpiredByStudent,
    updateStateByExpiration,
}