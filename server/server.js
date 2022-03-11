const express = require('express')
const app = express()
const port = 8468



app.use((req, res, next) => {
    console.log(req.headers)
    next()
})

app.use((err, req, res, next) => {
    console.log(err)
    res.status(500).send('Something broke!')
})

app.get('/', (req, res) => {
    console.log("recieved request")
    res.send("you're good amigo")
})

app.listen(port, (err) => {
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
})