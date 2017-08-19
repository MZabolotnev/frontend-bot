'use strict';


const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres', 'postgres', 'postgres', {
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
  user_first_name: {
    type: Sequelize.STRING
  },
  user_last_name: {
    type: Sequelize.STRING
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

const Admin = sequelize.define('admin', {
  login: {
    type: Sequelize.TEXT
  },
  password: {
    type: Sequelize.TEXT
  }
});

// Admin.sync({force: true}).then(() => {
//   return Admin.create({
//     login: 'admin',
//     password: 'admin'
//   });
// });

var app = require('./app');

var is_autorize;

app.get('/', function(req, res) {
  res.render('pages/index');
});

app.get('/*', function(req, res) {
  res.render('pages/error');
});

// app.get('/booking', function(req, res, next) {
//   res.render('pages/booking',{tables: 'many'});
// });

var exit = function() {
  app.get('/', function(req, res) {
    is_autorize = false;
    res.render('pages/index');
  });
  }

app.post('/admin', function(req, res) {
  console.log('передача админской формы', req.body)
  var login = req.body.login;
  var password = req.body.password;
  Admin.findAll({
          where: {
            login: login,
            password: password
            }
          }).then(admin => {
            console.log('ответ базы', admin.length)
            if (admin.length !== 0) {
              is_autorize = true;
              res.render('pages/admin_index', {authenticate: is_autorize});

            }
            else
              res.render('pages/notAdmin');
          })
});


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

app.post('/select_admin', function(req, res) {
  var date = req.body.date + 'T00:00:00.000Z';
  Reservation.findAll({
          where: {
            date: date
            }
          }).then(reservation => {
            console.log('base response', reservation);
            var tables = [
              {id: '1', booking: 'free', first_name: '', last_name: ''},
              {id: '2', booking: 'free', first_name: '', last_name: ''},
              {id: '3', booking: 'free', first_name: '', last_name: ''},
              {id: '4', booking: 'free', first_name: '', last_name: ''},
              {id: '5', booking: 'free', first_name: '', last_name: ''},
              {id: '6', booking: 'free', first_name: '', last_name: ''},
              {id: '7', booking: 'free', first_name: '', last_name: ''},
              {id: '8', booking: 'free', first_name: '', last_name: ''},
            ];
            var reserved_tables = [];
            for (var i = 0; i < reservation.length; i++) {
              reserved_tables.push(reservation[i].dataValues)
              console.log('values push', reservation[i].dataValues)
            };
            for (var i = 0; i < tables.length; i++) {
              for (var j = 0; j < reserved_tables.length; j++) {
                if (reserved_tables[j].table_id == tables[i].id) {
                  tables[i].booking = 'reserved';
                  tables[i].first_name = reserved_tables[j].user_first_name;
                  tables[i].last_name = reserved_tables[j].user_last_name;
                }
              }
            };
            console.log(tables);
            res.render('pages/booking_admin',{tab: tables, authenticate: is_autorize})
          })

});
