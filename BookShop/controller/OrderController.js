const mariadb = require('mysql2/promise');
const { StatusCodes } = require('http-status-codes');
const jwt = require('jsonwebtoken')
const ensureAuthorization = require('../auth');

const order = async (req, res) => {

    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
    });

    let authorization = ensureAuthorization(req, res)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        });
    } else {
        const { items, delivery, totalQuantity, totalPrice, userId, firstBookTitle } = req.body;

        let sql = "INSERT INTO delivery (address, receiver, contact) VALUES (?, ?, ?);"
        let values = [delivery.address, delivery.receiver, delivery.contact]

        let [results] = await conn.execute(sql, values);


        let delivery_id = results.insertId;

        sql = `INSERT INTO orders (book_title, total_quantity, total_price, user_id, delivery_id)
            VALUES ( ?, ?, ?, ?, ?);`
        values = [firstBookTitle, totalQuantity, totalPrice, authorization.id, delivery_id]

        [results] = await conn.execute(sql, values);

        let order_id = results.insertId;

        //items르ㄹ 가고, 장바구니에서 book_id, quantity 조회
        sql = 'SELECT book_id, quantity FROM cartItems WHERE IN (?)'
        let [orderItems, fields] = await conn.query(sql, [items]);


        sql = `INSERT INTO orderedBook (order_id, book_id, quantity) VALUES ?`
        values = [];
        orderItems.forEach((item) => {
            values.push([order_id, item.book_id, item.quantity])

        })


        results = await conn.query(sql, [values]);

        let result = deleteCartItems(conn, items);

        return res.status(StatusCodes.OK).json(result);
    }

}

const deleteCartItems = async (conn, items) => {
    let authorization = ensureAuthorization(req, res)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        });
    } else {
        let sql = `DELETE FROM cartItems WHERE id IN (?)`;

        let result = await conn.query(sql, [items]);
        return result;
    }
}



const getOrders = async (req, res) => {
    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
    });

    let authorization = ensureAuthorization(req, res)

    if (authorization instanceof jwt.TokenExpiredError) {
        return res.status(StatusCodes.UNAUTHORIZED).json({
            "message": "로그인 세션이 만료되었습니다. 다시 로그인 하세요."
        })
    } else if (authorization instanceof jwt.JsonWebTokenError) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            "message": "잘못된 토큰입니다."
        });
    } else {
        let sql = `SELECT orders.id, book_title, total_quantity, total_price, created_at,
                address, receiver, contact
                FROM orders LEFT JOIN delivery
                ON orders.delivery_id = delivery_id`

        let [rows, feilds] = await conn.query(sql);

        return res.status(StatusCodes.OK).json(rows)
    }

}

const getOrderDetail = async (req, res) => {

    const order_id = req.params.id;

    const conn = await mariadb.createConnection({
        host: '127.0.0.1',
        user: 'root',
        password: 'root',
        database: 'Bookshop',
        dateStrings: true
    });

    let sql = `SELECT book_id, title, author, price, quantity,
                address, receiver, contact
                FROM orderedBook LEFT JOIN books
                ON orderedBook.id = books.id
                WHERE order_id = ?`

    let [rows, feilds] = await conn.query(sql, [order_id]);

    return res.status(StatusCodes.OK).json(rows)

}

module.exports = {
    order,
    getOrders,
    getOrderDetail
}