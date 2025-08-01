const express = require('express')

const app = express()

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
    response.json(persons)
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

app.delete('/api/persons/:id', (request, response) => {
    const personId = Number(request.params.id)
    console.log("Deleting id:", personId)
    
    persons = persons.filter(person => person.id !== personId)

    console.log(`ID ${personId} deleted`)
    response.status(204).end()

})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
