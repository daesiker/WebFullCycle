const mysql = require('mysql2')

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'Youtube',
    dateStrings: true
})

connection.query(
    'select * from users;',
    function(err, results, fileds) {
        console.log(results)
        console.log(fileds)
    }
)