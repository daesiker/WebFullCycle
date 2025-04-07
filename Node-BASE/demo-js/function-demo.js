
function foo(arg) {
    return arg
}

function bar() {
    console.log('bar');
}

foo(bar)()




function add1(x,y) {
    return x + y
}

let add2 = function(x,y) {
    return x + y
}

const add3 = (x,y) => {
    return x + y
}

var add4 = (x,y) => x + y

console.log(add1(1,2))
console.log(add2(1,2))
console.log(add3(1,2))
console.log(add4(1,2))

