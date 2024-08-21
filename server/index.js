import express from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import { UserRouter } from './routes/user.js'
import cors from 'cors'
import cookieParser from 'cookie-parser'

dotenv.config()


const app = express()

// convert the data into json format
app.use(express.json())
app.use(cors({
    origin: ["http://localhost:5173"],
    credentials:true

}))

app.use(cookieParser())
app.use('/auth', UserRouter)

// connect to database
const dbConnect = async () => {
    await mongoose.connect('mongodb://localhost:27017/authentication')
    console.log('db connection successfull')
}

// starting the server

dbConnect()
.then(() => {
    app.listen(process.env.PORT, () => {
        console.log('server is running')
    })
})


