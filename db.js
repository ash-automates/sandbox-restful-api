const { MongoClient } = require("mongodb");
let connection;

module.exports = {
  connectToDB: (callback) => {
    MongoClient.connect(process.env.DB_URI)
      .then((client) => {
        connection = client.db();
        return callback();
      })
      .catch((error) => {
        console.log(error);
        return callback(error);
      });
  },
  getDB: () => {
    return connection;
  },
};
