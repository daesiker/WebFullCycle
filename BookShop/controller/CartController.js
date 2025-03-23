const jwt = require('jsonwebtoken')
const conn = require('../mariadb');
const {StatusCodes} = require('http-status-codes');
const dotenv = require('dotenv');
dotenv.config()


const addToCart = (req, res) => {
    const {book_id, quantity} = req.body;
    let authorization = ensureAuthorization(req)

    let sql = "INSERT INTO cartItems (book_id, quantity, user_id) VALUES (?, ?, ?);"
    let values = [book_id, quantity, authorization.id]

    conn.query(sql, values, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
};

const getCartItems = (req, res) => {

    const { selected } = req.body

    let authorization = ensureAuthorization(req)


    let sql = `SELECT cartitems.id, book_id, title, summary, quantity, price
                FROM cartitems LEFT JOIN books
                ON cartitems.id = books.id
                WHERE user_id = ? AND id IN (?)`

    const values = [authorization.id, selected]

    conn.query(sql, values, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
};

const removeCartItem = (req, res) => {
    const cartItemId = req.params.id;

    let sql = "DELETE FROM cartitems WHERE id = ?"

    conn.query(sql, cartItemId, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        }

        return res.status(StatusCodes.OK).json(results);
    })
};

function ensureAuthorization(req) {
    let receivedJwt = req.headers["authorization"];

    let decodedJwt = jwt.verify(receivedJwt, process.env.PRIVATE_KEY);

    return decodedJwt
}

module.exports = {
    addToCart,
    getCartItems,
    removeCartItem
}