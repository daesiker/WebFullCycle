const express = require('express')
const router = express.Router()

router.use(express.json())



let db = new Map()
var id = 1

//로그인
router.post('/login', (req, res) => {
    const {userId, password } = req.body
    let hasUserId = false
    var loginUser = {}
    db.forEach((user,id) => {
        if (user.userID == userId) {
            loginUser = user
        }
    })

    if (isExist(loginUser)) {
        if (loginUser.password === password) {

        } else {
            res.status(400).json({
                message : "비밀번호가 츨렸습니다."
            })
        }
    } else {
        res.status(404).json({
            message : "회원 정보가 없습니다."
        })
    }


})

function isExist(obj) {
    if (Object.keys(obj).length === 0 ) {
        return true
    } else {
        return false
    }
}

//회원가입
router.post('/join', (req, res) => {

    if (req.body == {}) {
        res.status(400).json({
            message : "입력 값을 다시 확인해주세요."
        })
    } else {
        const {userId} = req.body
        db.set(userId, req.body)

        res.status(201).json({
            message : `${userId}님 환영합니다.`
        })
    }

})

router.route('/users/:id')
    .get((req, res) => {

        let {userId} = req.params
    
        const user = db.get(userId)
    
        if (user) {
            res.status(200).json( {
                userId : user.userId,
                name : user.name
            })
        } else {
            res.status(404).json({
                message : "회원 정보가 없습니다."
            })
        }
    })
    .delete((req, res) => {
        let {userId} = req.params
        const user = db.get(userId)
        if (user) {
            db.delete(userId)
            res.status(200).json( {
                message : `${user.name}님 다음에 또 뵙겠습니다.`
            })
        } else {
            res.status(404).json({
                message : "회원 정보가 없습니다."
            })
        }
    })

module.exports = router