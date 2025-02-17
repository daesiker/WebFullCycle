const express = require('express')
const app = express()


let youtuber1 = {
    channelTitle : "십오야",
    sub : "593만명",
    videoNum : "993개"
}

let youtuber2 = {
    channelTitle : "침착맨",
    sub : "227만명",
    videoNum : "6.6천개"
}

let youtuber3 = {
    channelTitle : "테오",
    sub : "54.8만명",
    videoNum : "726개"
}

let db = new Map()
db.set(1, youtuber1)
db.set(2, youtuber2)
db.set(3, youtuber3)

app.get('/youtuber/:id', function(req, res) {
    let {id} = req.params
    id = parseInt(id)
    const youtuber = db.get(id)

    if (youtuber == undefined) {
        res.json({
            youtuber
        })
    } else {
        res.json({
            message : "없는 상품입니다."
        })
    }


})


app.listen(1234)