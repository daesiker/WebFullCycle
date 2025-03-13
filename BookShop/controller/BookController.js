const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv'); 
dotenv.config()


const allBooks = (req, res) => {
    let { category_id, news, limit, currentPage } = req.query;
    let sql = "select * from books"
    
    let offset = limit * (currentPage - 1);
    let values = []
    if (category_id) {
        sql = sql + " where category_id = ? AND pub_date between DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
        values.push(category_id)
    }else if (news && category_id) {
        sql = sql + " where category_id = ?"
        values.push(category_id)
    } else if (news) {
        sql = sql + " where pub_date between DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
        
    }

    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), parseInt(offset))

    conn.query(sql, category_id, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
        
    })

    
};

const bookDetail = (req, res) => {
    let {id } = req.params;

    let sql = "SELECT * FROM books LEFT JOIN category ON books.category_id = category.id where books.id = ?;"
    conn.query(sql, id, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results[0]) {
            return res.status(StatusCodes.OK).json(results[0]);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
        
    })
};


module.exports = {
    allBooks,
    bookDetail
}