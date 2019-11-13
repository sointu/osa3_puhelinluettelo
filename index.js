const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')


const app = express()

app.use(bodyParser.json())

//app.use(morgan('tiny'))

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

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
    res.json(persons)
})

app.get('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)

    if(person){
        return res.json(person)
    }else{
        return res.status(400).end()
    }
})

app.delete('/api/persons/:id', (req, res)=>{
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

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

app.get('/info', (req, res)=>{
res.send(
    `<p>Phonebook has info for ${persons.length} people.</p>
    <p>${new Date()}</p>`
    )
})

const port = 3001
app.listen(port, ()=>{
    console.log(`server running in port ${port}`)
})