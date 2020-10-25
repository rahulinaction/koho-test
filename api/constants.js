//password should be in env file for production
//Mysql data should be in env file
module.exports = Object.freeze({
  WEEKLY_AMOUNT: 20000,
  DAILY_AMOUNT: 5000,
  MYSQL_HOST:'localhost',
  MYSQL_USERNAME:'root',
  MYSQL_PASSWORD: 'password',
  MYSQL_DATABASE: 'banking',
  COUNT_LIMIT: 3
});