
let promise = new Promise(function(resolve, reject) {

    setTimeout(() => reslove("완료!"), 3000)
});


//promise의 기본 메소드
promise.then(function(result){
    console.log(result);
}, function(error) {

});
