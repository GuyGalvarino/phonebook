const cors = require('cors')
const express = require('express')
const morgan = require('morgan')

const app = express()

let data = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]

const randNum = () => {
    return Math.floor(Math.random() * 10000)
}

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

app.get('/api/persons', (request, response) => {
    response.json(data)
})

app.get('/info', (request, response) => {
    const infoHtml = `<p>Phonebook has info for ${data.length} people</p>
    <p>${Date()}</p>`
    response.send(infoHtml)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = data.find(person => person.id === id)
    console.log(person)
    if (person) {
        response.json(person)
    }
    else {
        response.status(404).json({ error: 'no person with that id' })
    }
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    data = data.filter(person => person.id !== id)

    response.status(204).end()
})

app.post('/api/persons', (request, response) => {
    if (!request.body.name) {
        return response.status(400).json({ error: 'name missing' })
    }
    if (!request.body.number) {
        return response.status(400).json({ error: 'number missing' })
    }
    if (data.find(person => person.name === request.body.name)) {
        return response.status(400).json({ error: 'name already exists' })
    }

    const newPerson = {
        id: randNum(),
        name: request.body.name,
        number: request.body.number
    }

    data = data.concat(newPerson)

    response.json(newPerson)
})

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`listening on ${PORT}`)
})