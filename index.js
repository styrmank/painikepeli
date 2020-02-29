const express = require('express')
const jsondb = require('simple-json-db')
const app = express()
const db = new jsondb('clicks.json')

// map containing the amount of clicks as the key and warded points as value
const awardPointsMap = new Map([[10, 5], [100, 40], [500, 250]])


app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html')

})


app.get('/clickhandler', function (req, res) {
    db.JSON({ 'clicks': db.get('clicks') + 1 })
    db.sync()
    res.send(checkWin(db.get('clicks')))
})

/**
 * ● 5 pistettä joka 10. painallus
 * ● 40 pistettä joka 100. painallus
 * ● 250 pistettä joka 500. painallus.
 * */


function checkWin(totalClicks) {
    var hasWon = false
    var awardPoints = 0

    awardPointsMap.forEach((awardedPoints, clicksNeeded) => {
        if (totalClicks % clicksNeeded == 0) {
            hasWon = true
            awardPoints = awardedPoints
        }
    })
    
    return {
        win: hasWon,
        award: awardPoints,
        remainingClicks: 10 - (totalClicks % 10)
    }
}

app.listen(process.env.PORT || 5000)