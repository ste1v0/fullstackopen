const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

const app = express()

app.use(cors())

let persons = [
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

let notes = [
    {
        id: 1,
        content: 'this is just a test',
        important: true
    },
    {
        id: 2,
        content: 'this is just another test',
        important: true
    },
    {
        id: 3,
        content: 'this is just a third test',
        important: true
    },
    {
        id: 4,
        content: 'and another one',
        important: false
    },
]

const logger = morgan(':method :url :status :response-time ms - :body')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(logger)

app.get('/', (request, response) => {
    response.send('App is working!')
})

app.get('/api/persons', (request, response) => {
    response.send(persons)
})

app.get('/api/notes', (request, response) => {
    response.send(notes)
})

app.get('/info', (request, response) => {
    const dateTimeObject = new Date();
    response.send(`Phonebook has info for ${persons.length} people<br/><br/>${dateTimeObject}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(n => n.id === id)

    person
        ? response.json(person)
        : response.status(404).end()
})

app.delete('/api/notes/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(n => n.id !== id)
    
    response.status(204).end()
})

app.use(express.json())

const generateId = () => {
    const maxId = persons.length > 0       
        ? Math.max(...persons.map(n => n.id))
        : 0
    return Math.floor(maxId + Math.random() * 500)
}

const generateNoteId = () => {
    const maxId = notes.length > 0       
        ? Math.max(...notes.map(n => n.id))
        : 0
    return Math.floor(maxId + Math.random() * 500)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name || !body.number) {
        return response.status(400).json({
            error: 'name or number is missing'
        })
    } else if (persons.find(n => n.name === body.name)) {
        return response.status(400).json({
            error: 'name must be unique'
        })
    } else {

    const person = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    persons = persons.concat(person)
    response.json(person)
}
})

app.post('/api/notes', (request, response) => {
    const body = request.body

    if (!body.content) {
        return response.status(400).json({
            error: 'note content is missing'
        })
    } else if (notes.find(n => n.content === body.content)) {
        return response.status(400).json({
            error: 'note must be unique'
        })
    } else {

    const note = {
        content: body.content,
        important: body.important,
        id: generateNoteId()
    }

    notes = notes.concat(note)
    response.json(note)
}
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }
  
app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})