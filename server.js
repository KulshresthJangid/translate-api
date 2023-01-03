const { query } = require("express")
const express = require("express")
const db = require('mysql')
const app = express()
const api = require('translate-google')

const connection = require('./db/mysql')

connection.connect(function(err) {
    if(err) throw err;
    console.log("Connected!")
})

const translateRoutes = require('./routes/translationRoutes')

app.use(express.json())
app.use(translateRoutes)

app.listen(3000, () => {
    console.log(`Server is up and running`)
})  