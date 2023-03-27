const cors = require('cors')
const express = require('express')
const morgan = require('morgan')
const Person = require('./mongo')

const app = express()

morgan.token('json', (request, response) => {
    if (request.method === 'POST'
        && request.get('content-type') === 'application/json') {
        return JSON.stringify(request.body)
    }
    return ''
})

app.use(express.static('build'))
app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :req[content-length] - :response-time ms :json'))

app.get('/info', (request, response, next) => {
    Person.find({}).count()
        .then(res => {
            const infoHtml = `<p>Phonebook has info for ${res} people</p>
    <p>${Date()}</p>`
            response.send(infoHtml)
        })
        .catch(e => next(e))
})

app.get('/api/persons', (request, response, next) => {
    const data = Person.find({})
        .then(res => response.json(res))
        .catch(e => next(e))
})

app.get('/api/persons/:id', (request, response, next) => {
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            }
            else {
                response.status(404).end()
            }
        })
        .catch(e => next(e))
})

app.delete('/api/persons/:id', (request, response, next) => {
    Person.findByIdAndRemove(request.params.id)
        .then((res) => response.status(204).end())
        .catch(e => next(e))
})

app.post('/api/persons', (request, response, next) => {
    if (!request.body.name) {
        return response.status(400).json({ error: 'name missing' })
    }
    if (!request.body.number) {
        return response.status(400).json({ error: 'number missing' })
    }

    const newPerson = new Person({
        name: request.body.name,
        number: request.body.number
    })

    newPerson.save()
        .then(res => response.json(res))
        .catch(e => next(e))
})

app.put('/api/persons/:id', (request, response, next) => {
    const updatedPerson = {
        name: request.body.name,
        number: request.body.number
    }
    console.log(updatedPerson)

    Person.findByIdAndUpdate(request.params.id, updatedPerson, { new: true })
        .then(res => response.json(res))
        .catch(e => next(e))
})

const logErr = (error, request, response, next) => {
    console.log(error.message)
    next(error)
}

const errorHandler = (error, request, response, next) => {
    if (error.name === 'CastError') {
        return response.status(400).json({ error: 'malformatted id' })
    }
    response.status(500).json({ error: 'something broke!' })
}

app.use(logErr)
app.use(errorHandler)

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})
