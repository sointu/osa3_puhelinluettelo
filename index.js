require('dotenv').config()

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const morgan = require('morgan')

const Person = require('./models/person')

const app = express()

app.use(cors())

app.use(express.static('build'))

app.use(bodyParser.json())

//app.use(morgan('tiny'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

const errorHandler = (error, req, res, next) => {
    console.log(error.message)
    if(error.name === 'CastError' && error.kind == 'ObjectId'){
        return res.status(400).send({error: 'Malformatted id'})
    }
    next(error)
}

let persons = [
      {
        "name": "Ada Lovelace",
        "number": "39-44-5323523",
        "id": 2
      },
      {
        "name": "Dan Abramov",
        "number": "12-46-234345",
        "id": 3
      },
      {
        "name": "Mary Poppendieck",
        "number": "39-23-6423122",
        "id": 4
      },
      {
        "name": "Arto Hellas",
        "number": "667788",
        "id": 1
      }
    ]
  
app.get('/api/persons', (req, res)=>{
    Person.find({}).then(persons => {
        res.json(persons.map(person => person.toJSON()))
    })
    
})

app.get('/api/persons/:id', (req, res, next)=>{
    Person.findById(req.params.id)
        .then(person => {
            if(person){
                res.json(person.toJSON())
            }else{
                res.status(404).end()
            }
            
        })
        .catch(error => 
            next(error)
        )
    
    /*    
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        return res.json(person)
    }else{
        return res.status(400).end()
    }
    */
})
/*
app.delete('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})
*/
app.delete('/api/persons/:id', (req, res, next)=>{
    Person.findByIdAndRemove(req.params.id)
        .then(result => 
            res.status(204).end())
        .catch(error => next(error))
})


app.post('/api/persons', (req, res) => {
    const body = req.body

    if(!body.name){
        return res.status(400).json({
            error: "Name missing."
        })
    }
    const person = new Person({
        name: body.name,
        number: body.number
    })

    person.save()
        .then(savedPerson => {
            res.json(savedPerson.toJSON())
        })
})

app.put('/api/persons/:id', (req, res, next)=>{
    const body = req.body

    const person = {
        name: body.name,
        number: body.number
    }

    Person.findByIdAndUpdate(req.params.id, person, {new: true})
        .then(updatedPerson => {
            if(Person.name === person.name){
                return res.status(400).json({
                    error: "Name must be unique."
                })
            }else{
                res.json(updatedPerson.toJSON())
            }
        })
        .catch(error => next(error))
})

/*
app.post('/api/persons', (req, res)=>{
    const getRand = (min, max) => {
        return Math.random() * (max - min) + min;
      }
    
      const body = req.body

      if(!body.name){
          return res.status(400).json({
              error: 'Name missing.'
            })
      }
      if(!body.number){
          return res.status(400).json({
              error: 'Number missing.'
          })
      }
      const personFound = persons.find(person => person.name === body.name)
      if(personFound){
          return res.status(400).json({
              error: 'Name must be unique.'
          })
      }
      const person = {
          name: body.name,
          number: body.number,
          id: getRand(0, 1000)
      }

      persons = persons.concat(person)
      res.json(person)
})
*/
app.get('/info', (req, res, next)=>{
    Person.count({}, (error, count)=>{
        console.log(count)
        if(error){
            next(error)
        }
        res.send(
            `<p>Phonebook has info for ${count} people.</p>
            <p>${new Date()}</p>`
            ) 
    })
})

app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, ()=>{
    console.log(`server running in port ${PORT}`)
})