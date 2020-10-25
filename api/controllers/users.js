const DB = require('./../db');
const moment = require('moment-timezone');
const constants = require('./../constants');

exports.getData = async (req, res) => {
  const content = req.body;
  //Using awaitable connection to ensure sequential execution of queries while looping
  const db = new DB().awaitableConnection();
  //Truncate table to remove any  previous content
  let output = [];
  const truncateQuery = "TRUNCATE History";
  await db.query(truncateQuery);

  for (const index in content) {
    // When we split we create an array of strings hence we then convert it into an object
    const item = content[index];
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
    const firstDay = moment(getFirstDay(transactionDay)).format(format);
    if(amount < constants.DAILY_AMOUNT) {

      try {
        const query = "SELECT * FROM History where date between '"+firstDay+"' and '"+transactionDay+"'"+" and customerId= "+customerId;
        let records = await db.query(query);
        let count = records.length;
        //Dont permit more than 3 operations
        if(count < 3) {
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
              let customerQuery = "INSERT IGNORE INTO USERS (id, name) VALUES("+customerId+",'')";
              await db.query(customerQuery);
              //Insert record into history table
              let recordQuery = "INSERT IGNORE INTO History (id, amount, customerId, date) VALUES("+transactionId+","+amount+","+customerId+",'"+transactionDay+"')";
              await db.query(recordQuery);
              outputItem.accepted = true;
            }
            //Fetch rows from database and add and see if new count exceeds 20000 per week or 5000 a day
          }else {
            //Insert into customers
            let customerQuery = "INSERT IGNORE INTO USERS (id,name) VALUES("+customerId+",'')";
            await db.query(customerQuery);
            let recordQuery = "INSERT IGNORE INTO History (amount,customerId,date) VALUES("+amount+","+customerId+",'"+transactionDay+"')";
            await db.query(recordQuery);
            outputItem.accepted = true;
          }
        }
      
      }catch (e) {
        console.log(e);
      }
    }
    output.push(outputItem); 
  }
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
