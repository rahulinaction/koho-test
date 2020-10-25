const mysql = require('mysql');
const util = require( 'util' );
const constants = require('./constants');
class DB {
  
  constructor() {
    //Add contents in config.js
    this.config =  {
      host: constants.MYSQL_HOST,
      user: constants.MYSQL_USERNAME,
      password: constants.MYSQL_PASSWORD,
      database: constants.MYSQL_DATABASE
    };
  }
  //Wrapper which allows awaitable connection for queries
  awaitableConnection( ) { // wrapped in a promise
    
    const connection = mysql.createConnection( this.config );
    return {
      query( sql, args ) {
        return util.promisify( connection.query )
          .call( connection, sql, args );
      },
      close() {
        return util.promisify( connection.end ).call( connection );
      }
    };
  }
}


module.exports = DB;