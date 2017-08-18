'use strict';


const Sequelize = require('sequelize');
const sequelize = new Sequelize('botdb', 'test', 'test', {
  host: 'localhost',
  dialect: 'postgres',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch(err => {
    console.error('Unable to connect to the database:', err);
  });

const Reservation = sequelize.define('reservations', {
  user_id: {
    type: Sequelize.INTEGER
  },
  table_id: {
    type: Sequelize.INTEGER
  },
  date: {
    type: Sequelize.DATE
  },
  time: {
    type: Sequelize.TIME
  }
});

var app = require('./app');

app.get('/', function(req, res) {
  res.render('pages/index');
});

// app.get('/booking', function(req, res, next) {
//   res.render('pages/booking',{tables: 'many'});
// });

app.post('/select', function(req, res) {
  var date = req.body.date + 'T00:00:00.000Z';
  Reservation.findAll({
          where: {
            date: date
            }
          }).then(reservation => {
            var tables = [
              {id: '1', booking: 'free'},
              {id: '2', booking: 'free'},
              {id: '3', booking: 'free'},
              {id: '4', booking: 'free'},
              {id: '5', booking: 'free'},
              {id: '6', booking: 'free'},
              {id: '7', booking: 'free'},
              {id: '8', booking: 'free'},
            ];
            var reserved_tables = [];
            for (var i = 0; i < reservation.length; i++) {
              reserved_tables.push(reservation[i].table_id)
            };
            for (var i = 0; i < tables.length; i++) {
              for (var j = 0; j < reserved_tables.length; j++) {
                if (reserved_tables[j] == tables[i].id) {
                  tables[i].booking = 'reserved';
                }
              }
            };
            res.render('pages/booking',{tab: tables});
          })

});
