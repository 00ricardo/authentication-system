import express from 'express'
import env from 'dotenv/config'

const app = express()
const PORT = process.env.PORT

app.get('/', (req, res) => {
    res.send(`Hello World! ${PORT}`)
})

app.listen(PORT, () => {
    console.log(`Example app listening on port ${PORT}`)
})