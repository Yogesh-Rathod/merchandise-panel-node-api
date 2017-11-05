// ========== Local Dependencies ============= //
let credentials = require('./credentials');

// == DB String for Local DB Connection == //
let databaseString = "mongodb://localhost/databaseName";

if (process.env.NODE_ENV) {
  // == DB String for Mongo Lab DB Connection (Production/QA Env) == //
  databaseString = "mongodb://" + credentials.username + ":" + credentials.password + "@ds149974.mlab.com:49974/excel-json";
}

module.exports = {
  dbConnection: () => {
    return databaseString;
  },
  jwtSecret: 'your JWT Secret'
};