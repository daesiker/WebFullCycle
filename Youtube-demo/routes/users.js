//express 모듈 세팅
const express = require('express')
const router = express.Router()
const conn = require('../mariadb')

//jwt 모듈
const jwt = require('jsonwebtoken')

//dotenv 모듈
const dotenv = require('dotenv');
dotenv.config()

const {body, param, validationResult} = require('express-validator')
router.use(express.json())

const validate = (req, res) => {
    const err = validationResult(req)

    if (err.isEmpty()) {
        return next()
    } else {
        return res.status(400).json(err.array())
    }
}


//로그인
router.post(
    '/login', 
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        validate
    ],
    (req, res) => {
    const { email, password } = req.body
    const sql = `select * from users where email = ?`
    conn.query(
        sql, email,
        (err, results) => {
            if(err) {
                return res.status(400).end()
            }
            let loginUser = results[0]
            if (loginUser && loginUser.password == password) {

                const token = (jwt.sign({
                    email : loginUser.email,
                    name : loginUser.name
                }, process.env.PRIVATE_KEY), {
                    expiresIn : '30m',
                    issuer : 'songa'
                })

                res.cookie("token", token, {
                    httpOnly : true

                })

                res.status(200).json({
                    message : `${loginUser.name}님 로그인 되었습니다.`
                })
            } else {
                res.status(403).json({
                    message: "이메일 또는 비밀번호가 틀렸습니다."
                })
            }
        }
    )
})


//회원가입
router.post(
    '/join', 
    [
        body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
        body('name').notEmpty().isString().withMessage('이름 확인 필요'),
        body('password').notEmpty().isString().withMessage('비밀번호 확인 필요'),
        body('contact').notEmpty().isString().withMessage('연락처 확인 필요'),
        validate
    ],
    (req, res) => {

        const {email, name, password, contact } = req.body
        let sql = `Insert into users (email, name, password, contact) values (?, ?, ?, ?)`
        let values = [email, name, password,contact]
        conn.query(
            sql, values,
            (err, results) => {
                if(err) {
                    return res.status(400).end()
                }
                res.status(201).json(results)
            }
        )
})

router
    .route('/users')
    .get(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ],
        (req, res) => {
        let {email} = req.body
        const sql = `select * from users where email = ?`
        conn.query(sql, email,
            (err, results, fields) => {
                if(err) {
                    return res.status(400).end()
                }
                res.status(200).json(results)
            }
        )
    })
    .delete(
        [
            body('email').notEmpty().isEmail().withMessage('이메일 확인 필요'),
            validate
        ],
        (req, res) => {
        let {email} = req.body
        const sql = `Delete from users where email = ?`
        conn.query(sql, email,
            (err, results) => {
                if(err) {
                    return res.status(400).end()
                }
                if (results.affectedRows == 0) {
                    return res.status(400).end()
                } else {
                    res.status(200).json(results)
                }
            }
        )

    })

module.exports = router