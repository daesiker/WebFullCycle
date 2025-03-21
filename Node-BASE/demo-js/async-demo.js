
async function f() {
    let promise = new Promise(function(resolve, reject) {
        setTimeout(() => resolve("완료!"), 3000);
    });

    let result = await promise
    console.log(result)
}




f().then(
    function(result) {
        console.log("promise resolve: ", result)
    },
    function(error) {
        console.log("promise error: ", error)
    }
)