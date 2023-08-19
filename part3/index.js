const express = require('express')

const app = express()

let notes = [
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

app.get('/', (request, response) => {
    response.send('App is working!')
})

app.get('/api/persons', (request, response) => {
    response.send(notes)
})

app.get('/info', (request, response) => {
    const dateTimeObject = new Date();
    response.send(`Phonebook has info for ${notes.length} people<br/><br/>${dateTimeObject}`)
})

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = notes.find(n => n.id === id)

    note
        ? response.json(note)
        : response.status(404).end()
})

app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    notes = notes.filter(n => n.id !== id)
    
    response.status(204).end()
})

app.use(express.json())

const generateId = () => {
    const maxId = notes.length > 0       
        ? Math.max(...notes.map(n => n.id))
        : 0
    return Math.floor(maxId + Math.random() * 500)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    const note = {
        name: body.name,
        number: body.number,
        id: generateId()
    }

    notes = notes.concat(note)
    response.json(note)
})

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})