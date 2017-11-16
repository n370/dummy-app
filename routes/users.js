'use strict';

var uuid = require('uuid');
var express = require('express');
var router = express.Router();
var users = [
  {
    _id: uuid(),
    timestamp: new Date(),
    fullname: 'Dylson Valente Neto',
    email: 'ama@n370.info',
    city: 'Montevideo',
    ridemode: 2,
    weekdays: [1,2,3,4,5]
  },
  {
    _id: uuid(),
    timestamp: new Date(),
    fullname: 'Arsen Tobagulov',
    email: 'arsen@payrollpanda.my',
    city: 'Kuala Lumpur',
    ridemode: 0,
    weekdays: [0,1,2,3,4,5,6]
  },
  {
    _id: uuid(),
    timestamp: new Date(),
    fullname: 'Toine Vaessen',
    email: 'toine@payrollpanda.my',
    city: 'Kuala Lumpur',
    ridemode: 0,
    weekdays: [0,6]
  },
  {
    _id: uuid(),
    timestamp: new Date(),
    fullname: 'Juan Passadore',
    email: 'juan@payrollpanda.my',
    city: 'Buenos Aires',
    ridemode: 1,
    weekdays: [2,6]
  }
];

router.get('/', function(req, res) {
  res.json(users);
});

router.post('/', function(req, res) {
  req.body._id = uuid();
  users.unshift(req.body);
  res.json(users);
});

router.delete('/:id', function(req, res) {
  users = users.filter(function(user) { return user._id !== req.params.id;});
  res.json(users);
});

module.exports = router;
