const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
dotenv.config()

var token = jwt.sign({foo: 'bar'}, process.env.PRIVATE_KEY)

var decoded = jwt.verify(token, process.env.PRIVATE_KEY)
console.log(token)
console.log(decoded)