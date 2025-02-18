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
    

    var youtubers = {}

    db.forEach(function(value, key) {
        youtubers[key] = value
    })

    res.json(youtubers)
})


app.get('/youtuber/:id', function(req, res) {
    let {id} = req.params
    id = parseInt(id)
    const youtuber = db.get(id)

    if (youtuber == undefined) {
        res.json({
            message : "유튜버 정보를 찾을 수 없습니다."
        })
    } else {
        
        res.json({
            youtuber
        })
    }


})




app.use(express.json())
app.post('/youtubers', (req, res) => {

    db.set(id++, req.body)

    res.json({
        message: `${req.body.channelTitle}님, 유튜버 생활을 응원합니다.`
    })

})

app.delete('/youtubers:id', (req, res) => {
    let {id} = req.params
    id = parseInt(id)
    const youtuber = db.get(id)
    if (youtuber == undefined) {
        res.json({
            message : `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {
        const channelTitle = youtuber.channelTitle
        db.delete(id)
        res.json({
            message: `${channelTitle}님, 아쉽지만 우리 인연을 여기까지 인가요?.`
        })
    }
})

app.delete('/youtubers', (req, res) => {

    if (db.size == 0) {
        res.json({
            message : `삭제할 유튜버가 없습니다.`
        })
    } else {
        db.clear()
        res.json({
            message : `전체 유튜버가 삭제되었습니다.`
        })
    }


    
    
})

app.put('youtubers/:id', (res, req) => {
    let {id} = req.params
    id = parseInt(id)
    let youtuber = db.get(id)
    if (youtuber == undefined) {
        res.json({
            message : `요청하신 ${id}번은 없는 유튜버입니다.`
        })
    } else {
        const oldTitle = youtuber.channelTitle
        const newTitle = req.body.channelTitle
        youtuber.channelTitle = newTitle
        db.set(id, youtuber)

        res.json({
            message: `${oldTitle}님, ${newTitle}로 변경되었습니다.`
        })
    }
})



app.listen(1234)