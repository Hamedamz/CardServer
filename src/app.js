var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/cards');
var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", function(callback){
  console.log("Connection Succeeded");
});

const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
app.use(morgan('combined'))
app.use(bodyParser.json())
app.use(cors())

var Card = require('../models/cards')

// Fetch all cards
app.get('/cards', (req, res) => {
  Card.find({}, 'title color', function (error, cards) {
    if (error) { console.error(error); }
    res.send({
      cards: cards
    })
  }).sort({_id:-1})
})

// Add new card
app.post('/cards', (req, res) => {
  var db = req.db;
  var title = req.body.title;
  var color = req.body.color;
  var new_card = new Card({
    title: title,
    color: color
  })

  new_card.save(function (error) {
    if (error) {
      console.log(error)
    }
    res.send({
      success: true,
      message: 'Card saved successfully!'
    })
  })
})

// Fetch single card
app.get('/cards/:id', (req, res) => {
  var db = req.db;
  Card.findById(req.params.id, 'title color', function (error, card) {
    if (error) { console.error(error); }
    res.send(card)
  })
})

// Update a card
app.put('/cards/:id', (req, res) => {
  var db = req.db;
  Card.findById(req.params.id, 'title color', function (error, card) {
    if (error) { console.error(error); }

    card.title = req.body.title
    card.color = req.body.color
    card.save(function (error) {
      if (error) {
        console.log(error)
      }
      res.send({
        success: true
      })
    })
  })
})

// Delete a card
app.delete('/cards/:id', (req, res) => {
  var db = req.db;
  Card.remove({
    _id: req.params.id
  }, function(err, card){
    if (err)
      res.send(err)
    res.send({
      success: true
    })
  })
})
app.listen(process.env.PORT || 5000)