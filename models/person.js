const mongoose = require('mongoose')
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)
var uniqueValidator = require('mongoose-unique-validator')

const url = process.env.MONGODB_URI

console.log('connecting to ', url)

mongoose.connect(url, { useNewUrlParser: true )
  .then(result => {
    console.log('Connected to MongoDB')
  })
  .catch(error => {
    console.log('error in connecting: ', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    unique: true
            
  },
  number: {
    type: String,
    minlength: 8
  }
})
    
personSchema.plugin(uniqueValidator);

personSchema.set('toJSON', {
  transform: (document, returnedObject)=>{
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)