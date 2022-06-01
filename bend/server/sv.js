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
app.use(cors())


app.use('/authapi', userRoutes)           //prefix /api/users

app.listen(PORT, () => {
    console.log(`Server listening in http://localhost:${PORT}`)
})