const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv'); 
dotenv.config()


const join = (req, res) => {
    const { email, password } = req.body;
    

    const salt = crypto.randomBytes(64).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64')

    let sql = `Insert into users (email, password, salt) values (?, ?, ?)`;
    let values = [email, hashPassword, salt];

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows) {
                res.status(StatusCodes.CREATED).json(results)
            } else {
                res.status(StatusCodes.BAD_REQUEST).end();
            }

        });
}

const login = (req, res) => {
    const { email, password } = req.body;
    let sql = `Select * from users where email = ?`;
    let values = email;

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }
            const loginUser = results[0];
            const hashPassword = crypto.pbkdf2Sync(password, loginUser.salt, 10000, 10, 'sha512').toString('base64')


            if (loginUser && loginUser.password == hashPassword) {
                const token = jwt.sign({
                    id : loginuser.id,
                    email : loginUser.email
                }, process.env.PRIVATE_KEY, {
                    expiresIn: '5m',
                    issuer: 'damien'
                });

                res.cookie("token", token, {
                    httpOnly: true
                });
                return res.status(StatusCodes.OK).json(results)
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end()
            }

            

        });
};

const passwordResetRequest = (req, res) => {
    const { email } = req.body;
    let sql = `Select * from users where email = ?`;

    conn.query(sql, email, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            const user = results[0]

            if (user) {
                res.status(StatusCodes.OK).json({
                    email : email
                })
            } else {
                res.status(StatusCodes.UNAUTHORIZED).end()
            }

            
        });
};

const passwordReset = (req, res) => {
    const { email, password } = req.body;
    

    const salt = crypto.randomBytes(64).toString('base64');
    const hashPassword = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64')

    let sql = `UPDATE users SET password = ?, salt = ?  WHERE email = ?`;
    let values = [hashPassword,salt, email]

    conn.query(sql, values, 
        (err, results) => {
            if (err) {
                console.log(err);
                return res.status(StatusCodes.BAD_REQUEST).end();
            }

            if (results.affectedRows == 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                res.status(StatusCodes.OK).json(results)
            }
            
        });
};

module.exports = {
    join, 
    login, 
    passwordResetRequest, 
    passwordReset
};
