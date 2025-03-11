const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv'); 
dotenv.config()


const allCategory = (req, res) => {

        let sql = "select * from category"
        conn.query(sql, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
    

    
};

module.exports = {
    allCategory
}