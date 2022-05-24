import 'dotenv/config'
import express from 'express'

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.get('/', (req, res) => {
    res.send(`Hello World! ${PORT}`)
})

app.listen(PORT, () => {
    console.log(`Testing dev ${PORT}`)
})