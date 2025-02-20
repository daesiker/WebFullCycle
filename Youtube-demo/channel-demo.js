const express = require('express')
const app = express()
const port = 7777
app.use(express.json())
app.listen(port)


let db = new Map()
var id = 1

app.route('/channels')
    .get((req, res) => {

        if (db.size) {
            let channels = []
            db.forEach(function(value, key) {
                channels.push(value)
            })
            res.status(200).json(channels)
        } else {
            res.status(404).json( {
                message : '조회할 채널이 없습니다.'
            })
        }
        

    })
    .post((req, res) => {

        if (req.body.channelTitle) {
            db.set(id++, req.body)
            res.status(201).json ({
                message: `${db.get(id-1).channelTitle}채널을 응원합니다.`
            })
        } else {
            res.status(400).json( {
                message : '요청 값을 제대로 보내주세요.'
            })
        }

        
    })


app.route('/channels/:id')
    .get((req, res) => {
        let id = req.params.id
        id = parseInt(id)
        const channel = db.get(id)
        if (channel) {
            res.status(200).json(channel)
        } else {
            res.status(404).json( {
                message : '요청 값을 제대로 보내주세요.'
            })
        }
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