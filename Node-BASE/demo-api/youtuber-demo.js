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
let id = 1
db.set(id++, youtuber1)
db.set(id++, youtuber2)
db.set(id++, youtuber3)

app.get('/youtubers', (req, res) => {
    res.json(db)
})


app.get('/youtuber/:id', function(req, res) {
    let {id} = req.params
    id = parseInt(id)
    const youtuber = db.get(id)

    if (youtuber == undefined) {
        res.json({
            message : "없는 상품입니다."
        })
    } else {
        
        res.json({
            youtuber
        })
    }


})

app.use(express.json())
app.post('/youtuber', (req, res) => {

    db.set(id++, req.body)

    res.json({
        message: `${req.body.channelTitle}님, 유튜버 생활을 응원합니다.`
    })

})

app.listen(1234)