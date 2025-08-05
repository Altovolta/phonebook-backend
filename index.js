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


app.get('/info', (request, response, next) => {
  const currentDate = new Date()
  Person.find({}).then(people => {
    const respMsg = `
        Phonebook has info for ${people.length} people
        <br /> 
        ${currentDate}`

    response.send(respMsg)
  }).catch(error => next(error))



})


app.get('/api/persons', (request, response, next) => {
  Person.find({}).then(people => {
    response.json(people)
  }).catch(error => next(error))
})


app.get('/api/persons/:id', (request, response, next) => {

  Person.findById(request.params.id)
    .then(person => {
      if (person){
        response.json(person)
      } else
      {
        response.status(404).end()
      }
    }).catch(error => next(error))

})


app.post('/api/persons/', (request, response, next) => {

  const personData = request.body

  Person.findOne({ name: personData.name })
    .then(searchedPerson => {

      if (searchedPerson) {
        response.status(409).json({ error: `The person ${personData.name} already exists` })

      } else {

        const person = new Person({
          name: personData.name,
          number: personData.number
        })

        person.save().then(savedPerson => {
          response.json(savedPerson)
        }).catch(error => next(error))
      }
    }).catch(error => next(error))
})

app.delete('/api/persons/:id', (request, response, next) => {

  Person.findByIdAndDelete(request.params.id)
    .then( () => {
      response.status(204).end()
    }).catch(error => next(error))

})


app.put('/api/persons/:id', (request, response, next) => {

  const personData = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        response.status(404).send({ error: 'The person does not exist' })
      } else {
        person.name = personData.name
        person.number = personData.number

        person.save()
          .then(updatedPerson => {
            response.json(updatedPerson)
          }).catch(error => next(error))
      }

    }).catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }

  console.error(`${error.name}: ${error.message}`)
  response.status(500).json({ error: 'Internal Server Error' })
}

app.use(errorHandler)


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
