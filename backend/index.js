const http = require('http')
const express = require('express')
const app = express()
const cors = require('cors');
const Note = require('./models/note')
const mongoose = require('mongoose')
require('dotenv').config()



app.use(express.json())
app.use(express.static('dist'))
app.use(cors());
//app.use(requestLogger) 



//const password = process.argv[2]

// DO NOT SAVE YOUR PASSWORD TO GITHUB!!
//const url = `mongodb+srv://fullstack:${password}@cluster0.vovpj4p.mongodb.net/?retryWrites=true&w=majority`;


//mongoose.set('strictQuery',false)
//mongoose.connect(url)

//const noteSchema = new mongoose.Schema({
  //content: String,
  //important: Boolean,
//})

 //Note = mongoose.model('Note', noteSchema)







let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true
  }
]

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})

//app.get('/api/notes/:id', (request, response) => {
  //const id = Number(request.params.id)
  //const note = notes.find(note => note.id === id)
  

  //if (note) {
    //response.json(note)
  //} else {
   // response.status(404).end()
  //}
//})


app.get('/api/notes/:id', (request, response, next) => {
  Note.findById(request.params.id)
    .then(note => {

      if (note) {
        response.json(note)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
    })



//app.get('/api/notes/:id', (request, response) => {
  //const id = Number(request.params.id)
  //const note = notes.find(note => {
    //console.log(note.id, typeof note.id, id, typeof id, note.id === id)

    
   // return note.id === id
  //})  
  //console.log(note)
  //response.json(note)


//app.get('/api/notes', (request, response) => {
  //response.json(notes)
//})

app.get('/api/notes', (request, response) => {
  Note.find({}).then(notes => {
    response.json(notes)
  })
})

app.delete('/api/notes/:id', (request, response) => {
  Note.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  })
  .catch(error => next(error))
})

const generateId = () => {
  const maxId = notes.length > 0
    ? Math.max(...notes.map(n => n.id))
    : 0
  return maxId + 1
}

app.post('/api/notes', (request, response) => {
  const body = request.body

  if (!body.content) {
    return response.status(400).json({ 
      error: 'content missing' 
    })
  }
 })

 app.put('/api/notes/:id', (request, response, next) => {
  const body = request.body

  const note = {
    content: body.content,
    important: body.important,
  }

  Note.findByIdAndUpdate(request.params.id, note, { new: true })
    .then(updatedNote => {
      response.json(updatedNote)
    })
    .catch(error => next(error))
})

app.prependOnceListener('/api/notes', (request, response) => {
  const body = request.body;

  if(body.content === undefined) return response.status(404).json({error: 'missing content'})

  const note = new Note({
    content: body.content,
    important: body.important || false,
  })

  note.save().then(savedNote => {
    response.json(savedNote)
  })
})

  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
  }

  app.use(unknownEndpoint)

  const errorHandler = (error, request, response, next) => {
    console.error(error.message);
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'malformatted id' });
    }
  
    next(error);
  };
  
  app.use(errorHandler);


//app.post('/api/notes', (request, response) => {
  //const note = request.body
  //console.log(note)
  //response.json(note)
//})

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});