const express = require('express')
const app = express()
const port = 1234


app.get('/', function(req, res) {
    res.send("Hello world!")
})


app.use(express.json())

app.post('/test', function(req, res) {
    res.send(req.body.message)
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


