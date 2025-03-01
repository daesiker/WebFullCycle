const express = require('express')
const router = express.Router()
const conn = require('../mariadb')

router.use(express.json())

let db = new Map()
var id = 1

router.route('/')
    .get((req, res) => {
        var {userId} = req.body
        const sql = `select * from channels where user_id = ?`

        if (userId) {
            conn.query(sql, userId,
                (err, results) => {
                    if (results.length) {
                        res.status(200).json(results)
                        res.end()
                    } else {
                        notFoundChannel(res)
                    }
                })
        } else {
            res.status(400).end()
        }
        
    })
    .post((req, res) => {
        const {name, userId} = req.body
        if (name && userId) {
            let sql = `Insert into channels (name, user_id) values (?, ?)`
            let values = [name, userId]
            conn.query(sql, values, (err, results) => {
                res.status(201).json(results)
            })
        } else {
            res.status(400).json( {
                message : '요청 값을 제대로 보내주세요.'
            })
        }
    })


router.route('/:id')
    .get((req, res) => {
        let id = req.params.id
        id = parseInt(id)
        const sql = `select * from channels where id = ?`
        conn.query(sql, id,
            (err, results) => {
                if(results.length) {
                    res.status(200).json(results)
                } else {
                    notFoundChannel(res)
                }
                
            }
        )
    })
    .put((req, res) => {
        let id = req.params
        id = parseInt(id)
        let channel = db.get(id)
        const oldTitle = channel.channelTitle

        if (channel) {
            const newTitle = req.body.channelTitle
            channel.channelTitle = newTitle
            db.set(id, channel)
            res.status(200).json({
                message:  `채널명이 정상적으로 수정되었습니다. 기존 ${oldTitle} -> 수정 ${newTitle}`
            })
        } else {
            res.status(404).json( {
                message : '요청 값을 제대로 보내주세요.'
            })
        }
    })
    .delete((req, res) => {
        let id = req.params
        id = parseInt(id)
        const channel = db.get(id)

        if (channel) {
            db.delete(id)
            res.status(200).json({
                message:  `${channel.channelTitle}이 정상적으로 삭제되었습니다.`
            })
        } else {
            res.status(404).json( {
                message : '요청 값을 제대로 보내주세요.'
            })
        }

    })

function notFoundChannel(res) {
    res.status(404).json( {
        message : '조회할 채널이 없습니다.'
    })
}
module.exports = router