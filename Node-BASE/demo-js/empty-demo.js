const obj1 = {}
const obj2 = { message : "안 빔"}
const str1 = "one"
const str2 = "" 
console.log(Object.keys(obj1))
console.log(Object.keys(obj2))

console.log(isEmpty(str1))
console.log(isEmpty(str2))

function isEmpty(obj) {
    if (Object.keys(obj).length === 0) {
        return true
    } else {
        return false
    }
}