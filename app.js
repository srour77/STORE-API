const express = require('express')
const app = express()
const connectDB = require('./db/connect')
const productsRouter = require('./routes/products')
const errorHandlerMiddleware = require('./middleware/error-handler')
const notFoundMiddleware = require('./middleware/not-found')
require('dotenv').config()
require('express-async-errors')
app.use(express.json())

//routes
app.get('/', function(req, res) {
    res.send('<h1>Store API</h1><a href="/api/v1/products">products route</a>')
})
app.use('/api/v1/products', productsRouter)

//middlewares
app.use(errorHandlerMiddleware)
app.use(notFoundMiddleware)

const port = process.env.PORT || 5500;
(async function start() {
    try {
        await connectDB(process.env.Mongo_URI);
        app.listen(port, function() {
        console.log(`server is now listening to port ${port}`)})
    }catch(err) {
        console.log(err)
    }
})()