const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
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


router.route('/')
    .get(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'),
            validate
        ],
        (req, res) => {
            var {userId} = req.body
            const sql = `select * from channels where user_id = ?`
            conn.query(sql, userId,
                (err, results) => {
                    if (err) {
                        return res.status(400).end()
                    }

                    if (results.length) {
                        res.status(200).json(results)
                    } else {
                        return res.status(400).end()
                    }
                })
    })
    .post(
        [
            body('userId').notEmpty().isInt().withMessage('숫자 입력 필요'), 
            body('name').notEmpty().isString().withMessage('문자 입력 필요'),
            validate
        ]
        ,(req, res) => {
            const {name, userId} = req.body
            let sql = `Insert into channels (name, user_id) values (?, ?)`
            let values = [name, userId]

            conn.query(sql, values, (err, results) => {
                if(err) {
                    return res.status(400).end();
                }
                res.status(201).json(results)
            }) 
    })


router.route('/:id')
    .get(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            validate
        ],
        (req, res) => {

            let id = req.params.id
            id = parseInt(id)
            const sql = `select * from channels where id = ?`
            conn.query(sql, id,
                (err, results) => {
                    if(err) {
                        return res.status(400).end()
                    }
                    if(results.length) {
                        res.status(200).json(results)
                    } else {
                        return res.status(400).end()
                    }
                }
        )
    })
    .put(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            body('name').notEmpty().isString().withMessage('채널명 오류'),
            validate
        ],
        (req, res) => {
            let id = req.params.id
            id = parseInt(id)
            const {name} = req.body
            const sql = `update channels set name = ? where id = ?`
            const values = [name, id]
            conn.query(sql, values,
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
    .delete(
        [
            param('id').notEmpty().withMessage('채널 id 필요'),
            validate
        ],
        (req, res) => {
        let id = req.params
        id = parseInt(id)
        const sql = `Delete from users where email = ?`
        conn.query(sql, id,
            (err, results, fields) => {
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