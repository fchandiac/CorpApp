const config = require('../config.json')
const server_url = config.server_url

function create(lesson_id, student_id, quanty, amount, expiration ) {
    let data = {'lesson_id':lesson_id, 'student_id':student_id, 'quanty':quanty, 'amount':amount, 'expiration':expiration}
    const session = new Promise((resolve, reject) => {
        fetch(server_url + 'sales/create', {
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


function findAllByLessonAndBetweenExpirationGroupByStudent(lesson_id, start_date, end_date ) {
    let data = {'lesson_id':lesson_id,'start_date':start_date, 'end_date':end_date}
    const session = new Promise((resolve, reject) => {
        fetch(server_url + 'sales/findAllByLessonAndBetweenExpirationGroupByStudent', {
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

export {create, findAllByLessonAndBetweenExpirationGroupByStudent}