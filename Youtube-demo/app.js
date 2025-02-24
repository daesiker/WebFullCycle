const express = require('express')
const app = express()

const port = 7777
app.listen(port)

const userRouter = require('./routes/users')
const channelRouter = require('./routes/channels')


app.use("/", userRouter)
app.use("/channels", channelRouter)