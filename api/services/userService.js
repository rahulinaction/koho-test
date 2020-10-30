const moment = require('moment-timezone');
const constants = require('./../constants');

class UserService {
    constructor(db, content) {
      this.db = db;
      this.content = content;
    }
    // Get Monday for computing weekly amounts
    getFirstDay(d) {
        d = new Date(d);
        let day = d.getDay();
        let interval = day == 0 ? -6:1;
        let diff = d.getDate() - day + interval; 
        return new Date(d.setDate(diff));
    }

    async dataInsertion(customerId, transactionId, amount, transactionDay) {
      let customerQuery = "INSERT IGNORE INTO USERS (id, name) VALUES("+customerId+",'')";
      await this.db.query(customerQuery);
      //Insert record into history table
      let recordQuery = "INSERT IGNORE INTO History (id, amount, customerId, date) VALUES("+transactionId+","+amount+","+customerId+",'"+transactionDay+"')";
      await this.db.query(recordQuery);
    }

    async getData() {

      let output = [];
      
      const truncateQuery = "TRUNCATE History";
      await this.db.query(truncateQuery);
    
      for (const index in this.content) {
        // When we split we create an array of strings hence we then convert it into an object
        const item = this.content[index];
        let outputItem = {
          "id": item.id,
          "customer_id": item.customer_id,
          "accepted":false
        }
        const transactionId = item.id;
        const amount = parseFloat(item.load_amount.replace("$",""));
        const customerId = parseInt(item.customer_id);
        const format = "YYYY-MM-DD HH:mm:ss"
        const time = item.time;
        //Setting UTC timezone as default for computation
        moment.tz.setDefault("UTC");
        const transactionDay = moment(time).format(format);
        const firstDay = moment(this.getFirstDay(transactionDay)).format(format);
        if(amount < constants.DAILY_AMOUNT) {
    
          
          const query = "SELECT * FROM History where date between '"+firstDay+"' and '"+transactionDay+"'"+" and customerId= "+customerId;
          let records = await this.db.query(query);
          let count = records.length;
          //Dont permit more than 3 operations
          if(count < constants.COUNT_LIMIT) {
            if(count > 0) {
              let currentDay = moment(transactionDay).format("YYYY-MM-DD");
              let dailyAmount = amount;
              let cumulativeAmount = amount;
              for( let index in records) {
                let record = records[index];
                cumulativeAmount+= record.amount
                if(currentDay == moment(record.date).format("YYYY-MM-DD")) {
                  dailyAmount+= record.amount;
                }
              }
    
              if(cumulativeAmount < constants.WEEKLY_AMOUNT && dailyAmount < constants.DAILY_AMOUNT ) {
                //Inserting users and history  to store the record
                await this.dataInsertion(customerId, transactionId, amount, transactionDay);
                outputItem.accepted = true;
              }
              //Fetch rows from database and add and see if new count exceeds 20000 per week or 5000 a day
            }else {
              //Inserting users and history  to store the record
              await this.dataInsertion(customerId, transactionId, amount, transactionDay);
              outputItem.accepted = true;
            }
          }
          
        }
        output.push(outputItem); 
      }
      
      return output;
    }
}

module.exports = UserService;