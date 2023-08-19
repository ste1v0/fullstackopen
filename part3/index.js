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

const PORT = 3001

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})