const mongoose = require('mongoose')


const password = process.argv[2]

const url = 
    `mongodb+srv://sointu:${password}@cluster0-d1zcd.mongodb.net/puhelinluettelo?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true })

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        minlength: 3
    },
    number: {
        type: Number,
        minlength: 8
    }
})




const Person = mongoose.model('Person', personSchema)

if(process.argv.length === 3){
    Person.find({}).then(result => {
        console.log('phonebook:')
        result.forEach(p => {
            console.log(`${p.name} ${p.number}`)
        })
        mongoose.connection.close()
    })
}

if(process.argv.length === 5){
    const person = new Person({
        name: process.argv[3],
        number: process.argv[4] 
    })

    console.log(`added ${person.name} number ${person.number} to phonebook`)

    
    person.save().then((response)=>{
        console.log(response)
        mongoose.connection.close()
    })
}
