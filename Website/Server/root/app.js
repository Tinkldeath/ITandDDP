const express = require("express");
const cors = require('cors');
const parser = require('body-parser');

const app = express();

// Uses
app.use(cors())
app.use(parser.json())

// Routes
app.get("/", function(req, res){
    res.send("<h2>Привет Express!</h2>");
});

module.exports = app;