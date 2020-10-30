Project Instructions 
1)The project has 2 components

a) The front end part which is a React project with typescript integration which is in the root directory
b) The backend part which is a NodeJS express api which is located in api folder. The application also uses mysql
database for holding the records 

To run this project

a) First clone this project from github
b) npm install inside root directory
c) Navigate to src/api and run npm install inside the api directory


Once the modules have been installed we need to setup the database for the project
Setup mysql client and start the mysql server.
Please follow the links https://dev.mysql.com/doc/mysql-osx-excerpt/5.7/en/osx-installation-launchd.html and 
https://dev.mysql.com/doc/mysql-osx-excerpt/5.7/en/osx-installation.html for setting up and
starting the mysql server.

The sql file is added in the src/db.sql . The statements needed to be imported in the mysql db for the application. 
For database connection currently the credentials are stored in the api/constants.js and can be changed accordingly.

Open a terminal and navigate to the root directory and run ``npm start``

Open another terminal and navigate to the api directory and run ``npm start``

The application gives a provision of either copying the value in the textarea or selecting a file.

The send button generates a tabular format of the output response.

The screenshots for the same are added in the screenshots folder.
