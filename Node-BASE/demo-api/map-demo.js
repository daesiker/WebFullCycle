const express = require('express')
const app = express()
app.listen(1234)

let db = new Map()

let notebook = {
    productName: "Notebook",
    price: 200000
}

db.set(1, "NoteBook") // 키로 밸류를 찾을 수 있는 한 쌍을 저장
db.set(2, "Cup")
db.set(3, "Chair")


app.get('/:id', function(req, res) {
    let {id} = req.params
    id = parseInt(id)

    if (dp.get(id) == undefined) {
        res.json({
            id: id,
            productName: db.get(parseInt(id))
        })
    } else {
        res.json({
            message : "없는 상품입니다."
        })
    }

    

})

