import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import userRoutes from '../routes/auth/ManUsers.js'
import { connectDatabase } from '../db/conn.js'

connectDatabase()

const app = express()
const PORT = process.env.PORT || 3001

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('utils'));
app.use('/img', express.static('img'));

//The order of things matter 
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "x-access-token, Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use(cors())
app.use('/authapi', userRoutes)           //prefix /api/users


app.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`)
})