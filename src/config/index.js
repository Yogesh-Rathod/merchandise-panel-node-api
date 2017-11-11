// ========== Local Dependencies ============= //
let credentials = require('./credentials');

// == DB String for Local DB Connection == //
let databaseString = "mongodb://localhost/merchandisePanel";

if (process.env.NODE_ENV) {
  // == DB String for Mongo Lab DB Connection (Production/QA Env) == //
  databaseString = "mongodb://" + credentials.username + ":" + credentials.password + "@ds157325.mlab.com:57325/merchandise-panel";
}

module.exports = {
  dbConnection: () => {
    return databaseString;
  },
  jwtSecret: 'your JWT Secret'
};