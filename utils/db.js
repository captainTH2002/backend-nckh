const { Sequelize } = require("sequelize");
const { database } = require("../config");

let sequelize = new Sequelize(database.database, database.username, database.password, {
  host: database.host,
  password: database.password,
  username: database.username,
  port: database.port,
  dialect: database.dialect,
  operatorsAliases: 0,
  // pool: {
  //   max: database.pool.max,
  //   min: database.pool.min,
  //   acquire: database.pool.acquire,
  //   idle: database.pool.idle,
  // },
  dialectOptions: {
    // useUTC: false, // for reading from database
    dateStrings: true,
    typeCast(field, next) {
      // for reading from database
      if (field.type === "DATETIME") {
        return field.string();
      }
      return next();
    },
  },
  timezone: "+07:00",
});
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((err) => { 
    console.error("Unable to connect to the database:", err);
  });
  // sequelize.sync({ force: true }).then(() => {
  //   console.log("yes re-sync done!");
  // });
module.exports = sequelize;         
