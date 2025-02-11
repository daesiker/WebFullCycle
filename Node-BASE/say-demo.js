const express = require('express')
const app = express()


app.get('/hello', function (req, res) {
    res.json({
        say: '안녕하세요'
    })
})

app.get('/bye', function (req, res) {
    res.json({
        say: '안녕히 가세요'
    })
})

app.get('/nicetomeetyou', function (req, res) {
    res.json({
        say: '만나서 반갑습니다.'
    })
})


app.listen(1234)