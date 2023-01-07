require('dotenv').config()
const products = require('./products.json')
const produstsModel = require('./models/product')
const connectDB = require('./db/connect')

async function start() {
    try {
        await connectDB(process.env.Mongo_URI)
        produstsModel.deleteMany()
        await produstsModel.create(products)
    } catch (err) {
        console.log(err)
    }
}
start()