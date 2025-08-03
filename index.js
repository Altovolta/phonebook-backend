const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')

morgan.token('data', (req) => {
    return JSON.stringify(req.body)
})

const app = express()

app.use(express.static('dist'))
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data'))
app.use(express.json())

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

app.get('/info', (request, response) => {
    const currentDate = new Date();
    const respMsg = `
        Phonebook has info for ${persons.length} people
        <br /> 
        ${currentDate}
    `

    response.send(respMsg)
})


app.get('/api/persons', (request, response) => {
    Person.find({}).then(people => {
        response.json(people)
    })
}) 


app.get('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id)
    const person = persons.find(person => person.id === personId)
    if (person){
        response.json(person)
    } else 
    {
        response.status(404).end()
    }
    
})

function generateId() {
    return Math.floor(Math.random() * (2**32) )
}

app.post('/api/persons/', (request, response) => {

    const personData = request.body
    
    if (!personData.name || !personData.number) {
        return response.status(400).json({ error: 'name or number missing' })
    }
    
    const personExists = persons.some(person => person.name === personData.name)

    if (!personData.name || !personData.number) {
        response.status(400).json({ error: "Name or number is missing" })

    }
    else if (personExists) {
        response.status(409).json({error: `The person ${personData.name} already exists`})

    } else {
        const person = {
            id: generateId(),
            name: personData.name,
            number: personData.number
        }
    
        persons = persons.concat(person)
    
        response.json(person)
    }

    
})

app.delete('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id)

    persons = persons.filter(person => person.id !== personId)
    response.status(204).end()

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
