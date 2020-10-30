const DB = require('./../db');
const UserService = require('../services/userService');

exports.getData = async (req, res) => {
  const content = req.body;
  //Using awaitable connection to ensure sequential execution of queries while looping
  const db = req.app.get('db');
  const userService = new UserService(db, content);
  let output = await userService.getData();
  //Truncate table to remove any  previous content
  res.send(output);
};

