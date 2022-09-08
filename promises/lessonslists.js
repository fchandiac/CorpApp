const config = require('../config.json')
const server_url = config.server_url

const lessons = require('./lessons')

function create(lesson_id, student_id) {
    let data = { 'lesson_id': lesson_id, 'student_id': student_id }
    const lessonslists = new Promise((resolve, reject) => {
        fetch(server_url + 'lessonslists/create', {
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
    return lessonslists
}

function findAllByStudent(student_id) {
    let data = { 'student_id': student_id }
    const lessonslists = new Promise((resolve, reject) => {
        fetch(server_url + 'lessonslists/findAllByStudent', {
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
    return lessonslists
}

function IncriptionListByStudente(studen_id) {
    const list = new Promise((resolve, reject) => {
        lessons.findAll()
            .then(less => {
                findAllByStudent(studen_id)
                    .then(list => {
                        var lessonsFilt = less.map(item => {
                            if (list.find(el => el.Lesson.id === item.id) === undefined) {
                                return item
                            }
                        })
                        lessonsFilt = lessonsFilt.filter(i => i !== undefined)
                        resolve(lessonsFilt)
                    })
                    .catch(err => { reject(err) })
            })
            .catch(err => { reject(err) })
    })

    return list
}

function findAllByLesson(lesson_id) {
    let data = { 'lesson_id': lesson_id }
    const lessonslists = new Promise((resolve, reject) => {
        fetch(server_url + 'lessonLists/findAllByLesson', {
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
    return lessonslists
}

function destroy(id) {
    let data = { 'id': id }
    const lessonslists = new Promise((resolve, reject) => {
        fetch(server_url + 'lessonLists/destroy', {
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
    return lessonslists
}

function countStudentsByLesson () {
    const lessonslists = new Promise((resolve, reject) => {
        fetch(server_url + 'lessonLists/countStudentsByLesson', {
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
    return lessonslists

}

export {
    create,
    findAllByStudent,
    IncriptionListByStudente,
    findAllByLesson,
    destroy,
    countStudentsByLesson
}