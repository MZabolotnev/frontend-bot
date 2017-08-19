'use strict';
var bodyParser = require('body-parser');
var multer = require('multer');
var http = require('http')
, express = require('express');

var app = module.exports = express();

//Configuration

app.set('port', process.env.PORT || 8123);
app.set('views', './views');
app.set('view engine', 'jade');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
