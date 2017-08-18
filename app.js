'use strict';
var bodyParser = require('body-parser');
var multer = require('multer');
var http = require('http')
, express = require('express');
// , stylus = require('stylus');

var app = module.exports = express();

//Configuration

app.set('port', process.env.PORT || 8123);
app.set('views', './views');
app.set('view engine', 'jade');


// express.static('/public');
// app.use(express.static('public/img' + "/public"));
// app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(__dirname + '/public'));
// app.use(stylus.middleware({
//   src: __dirname + '/public',
//   compress: true
// }));
