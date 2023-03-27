const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

mongoose.connect(url)
    .then(res => console.log("connected to the db"))
    .catch(e => console.log("error connecting to the db"))

const personSchema = new mongoose.Schema({
    name: String,
    number: String
})

personSchema.set('toJSON', {
    transform: (doc, retObj) => {
        retObj.id = String(retObj._id)
        delete retObj._id
        delete retObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)