const arr = [1,2,3,4,5]

const foreachArr = arr.forEach(function(a, b, c) {
    return a * 2
})

const mapArr = arr.map(function(a, b, c) {
    return a * 2
})

console.log(`forEach로 리턴하면 ${foreachArr},
            map으로 리턴하면 ${mapArr}`)