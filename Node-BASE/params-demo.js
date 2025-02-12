const express = require('express')
const app = express()




app.get('/product/:n', function (req, res) {

    let number = parseInt(req.params.n) - 10

    res.json({
        num : number
    })
})

// app.get('/:nickname', function(req, res) {

//     const nickname = req.params.nickname

//     res.json( {
//         channel: nickname
//     })
// })


app.get('/watch', function(req, res) {
    const q = req.query

    const {v, t} = req.query

    res.json({
        video : q.v,
        timeline: q.t
    })

})



app.listen(1234)