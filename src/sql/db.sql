/* SQL Commands for database*/

CREATE DATABASE banking;

use banking;

CREATE TABLE  IF NOT EXISTS Users (
id INT NOT NULL,
name VARCHAR(10),
PRIMARY KEY (id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;


CREATE TABLE IF NOT EXISTS History (  
   id INT NOT NULL,  
   amount INT NOT NULL,	
   customerId INT NOT NULL,	
   date DATETIME NOT NULL,
   PRIMARY KEY (id),
   CONSTRAINT fk_customerId
   FOREIGN KEY (customerId) 
        REFERENCES Users(id)
)ENGINE=InnoDB DEFAULT CHARSET=utf8;

