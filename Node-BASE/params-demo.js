const express = require('express')
const app = express()


let book = {
    title: 'Node.js를 공부해보자',
    price: 20000,
    description: '이 책 좋음 왜? 김송아가 지음'
}
app.get('/product/:n', function (req, res) {
    res.json({
        num : req.params.n
    })
})


app.listen(1234)