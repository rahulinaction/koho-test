const DB = require('./../db');
const moment = require('moment-timezone');
const constants = require('./../constants');
const UserService = require('../services/userService');

exports.getData = async (req, res) => {
  const content = req.body;
  //Using awaitable connection to ensure sequential execution of queries while looping
  const db = req.app.get('db');
  const userService = new UserService(db, content);
  let output = await userService.getData();
  console.log('The output  obtained here is',output);
  //Truncate table to remove any  previous content
  res.send(output);
};

// Start date from monday
function getFirstDay(d) {
  d = new Date(d);
  let day = d.getDay();
  let interval = day == 0 ? -6:1;
  let diff = d.getDate() - day + interval; 
  return new Date(d.setDate(diff));
}
