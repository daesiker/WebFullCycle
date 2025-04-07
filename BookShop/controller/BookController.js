const conn = require('../mariadb');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const ensureAuthorization = require('../auth');
const dotenv = require('dotenv');
dotenv.config()


const allBooks = (req, res) => {
    let allBooksRes = {};
    let { category_id, news, limit, currentPage } = req.query;
    let sql = "select SQL_CALC_FOUND_ROWS *, (select count(*) FROM likes where books.id = liked_book_id) as likes from books"

    let offset = limit * (currentPage - 1);

    let values = []
    if (category_id) {
        sql = sql + " where category_id = ? AND pub_date between DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"
        values.push(category_id)
    } else if (news && category_id) {
        sql = sql + " where category_id = ?"
        values.push(category_id)
    } else if (news) {
        sql = sql + " where pub_date between DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW()"

    }

    sql += " LIMIT ? OFFSET ?";
    values.push(parseInt(limit), offset)

    conn.query(sql, category_id, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        if (results.length) {
            results.map(function(result) {
                result.pubDate = result.pub_date
                delete result.pub_date
            })
            allBooksRes.books = results;
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }

    })

    sql = "SELECT found_rows()";

    conn.query(sql, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }
        let totalCount =  results[0].found_rows();
        let pagination = {};
        pagination.currentPage = currentPage;
        pagination.totalCount = results[0]["found_rows()"];

        allBooksRes.pagination = pagination
        return res.status(StatusCodes.OK).json(allBooksRes);
        

    })


};

const bookDetail = (req, res) => {
    let book_id = req.params.id;
    let authorization = ensureAuthorization(req, res)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        });
    } else if (authorization instanceof ReferenceError) {
        let sql = `SELECT *, 
                        (select count(*) from likes where liked_book_id = books.id) as likes
                    FROM books 
                    LEFT JOIN category 
                    ON books.category_id = category.category_id 
                    where books.id = ?;`
        let values = [book_id]
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
    } else {
        let sql = `SELECT *, 
                        (select count(*) from likes where liked_book_id = books.id) as likes, 
                        (select exists (select * from likes where user_id = ? and liked_book_id = ?)) as liked 
                    FROM books 
                    LEFT JOIN category 
                    ON books.category_id = category.category_id 
                    where books.id = ?;`
        let values = [authorization.id, book_id, book_id]
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
    }

};


module.exports = {
    allBooks,
    bookDetail
}