const fs = require('fs');
const main_view = fs.readFileSync('./main.html', 'utf-8')
const mariadb = require('./database/connect/mariadb');
const orderlist_view = fs.readFileSync('./orderlist.html', 'utf-8')

let handle = {}

function main(response) {
    mariadb.query("select * from product", function(err, rows) {
        console.log(rows)
    })
    response.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8'});
    response.write(main_view);
    response.end()
}

function redRacket(response) {
    fs.readFile('./img/redRacket.png', function(err,data){
        response.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8'});
        response.write(data);
        response.end()
    })
}

function blueRacket(response) {
    fs.readFile('./img/blueRacket.png', function(err,data){
        response.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8'});
        response.write(data);
        response.end()
    })
}

function blackRacket(response) {
    fs.readFile('./img/blackRacket.png', function(err,data){
        response.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8'});
        response.write(data);
        response.end()
    })
}

function order(response, productId) {
    response.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8'});
    mariadb.query("Insert into orderlist values(" + productId + ", '"  + new Date().toLocaleDateString() + "');", function(err, rows) {
        console.log(rows)
    })
    response.write('order page');
    response.end()
}

function css(response) {
    fs.readFile('./main.css', function(err,data){
        response.writeHead(200, {'Content-Type' : 'text/html; charset=UTF-8'});
        response.write(data);
        response.end()
    })
}

function orderlist(response) {
    console.log('orderlist');

    response.writeHead(200, {'Content-Type' : 'text/html'});

    mariadb.query("SELECT * FROM orderlist", function(err, rows) {
        response.write(orderlist_view);

        rows.forEach(element => {
            response.write("<tr>" 
                        + "<td>"+element.id+"</td>"
                        + "<td>"+element.date+"</td>"
                        + "</tr>");
        });
        
        response.write("</table>");
        response.end();
    })
}


handle['/order'] = order;
handle['/orderlist'] = orderlist;
handle['/'] = main;
handle['/img/redRacket.png'] = redRacket;
handle['/img/blueRacket.png'] = blueRacket;
handle['/img/blackRacket.png'] = blackRacket;
handle['/main.css'] = css


exports.handle = handle