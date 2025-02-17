const express = require('express')
const app = express()


let youtuber1 = {
    channelTitle : "십오야",
    sub : "593만명",
    videoNum : "993개"
}

let youtuber2 = {
    channelTitle : "침착맨",
    sub : "227만명",
    videoNum : "6.6천개"
}

let youtuber3 = {
    channelTitle : "테오",
    sub : "54.8만명",
    videoNum : "726개"
}


app.get('/:nickname', function(req, res) {

    const nickname = req.params

    if (nickname == "@15ya.fullmoon") {
        res.json = (youtuber1)
    } else if (nickname == "@ChimChakMan_Official") {
        res.json = (youtuber2)
    } else if (nickname == "@TEO_universe"){
        res.json = (youtuber3)
    } else {
        res.json = ({
            message : "저희가 모르는 유튜버 입니다."
        })
    }

})




app.listen(1234)