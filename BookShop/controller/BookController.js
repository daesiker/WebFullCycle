const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const dotenv = require('dotenv'); 
dotenv.config()


const allBooks = (req, res) => {
    let { category_id, news, limit, currentPage } = req.query;
    let sql = "select *, (select count(*) FROM likes where books.id = liked_book_id) as likes from books"
    
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
    let {user_id} = req.body;
    let book_id = req.params.id;

    let sql = "SELECT *, (select count(*) from likes where liked_book_id = books.id) as likes, (select exists (select * from likes where user_id = ? and liked_book_id = ?)) as liked FROM books LEFT JOIN category ON books.category_id = category.category_id where books.id = ?;"
    let values = [user_id, book_id, book_id]
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