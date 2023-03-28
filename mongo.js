const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URL

mongoose.connect(url)
    .then(() => console.log('connected to the db'))
    .catch(e => console.log('error connecting to the db\n', e))

// const numberValidator = num => /^([0-9]{8,})|(([0-9]{2})-([0-9]{6,}))|(([0-9]{3})-([0-9]{5,}))$/.test(num)

const numberValidator = num => /^[0-9]{8,}$/.test(num) || /^([0-9]{2})-([0-9]{6,})$/.test(num) || /^([0-9]{3})-([0-9]{8,})$/.test(num)

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
    },
    number: {
        type: String,
        validate: {
            validator: numberValidator,
            message: 'invalid number'
        }
    }
})

personSchema.set('toJSON', {
    transform: (doc, retObj) => {
        retObj.id = String(retObj._id)
        delete retObj._id
        delete retObj.__v
    }
})

module.exports = mongoose.model('Person', personSchema)