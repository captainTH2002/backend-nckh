require("dotenv").config();
const config = {
  api: {
    port: 8080,
  },
  database: {
    username: "admin",
    password: "hnam23012002",
    database: "qlttb",
    port: 3306, // thay đổi port kết nối tới MySQL từ 8080 thành 3307
    host: "localhost",
    // username: process.env.MYSQL_USERNAME,
    // password: process.env.MYSQL_PASSWORD,
    // database: process.env.MYSQL_DATABASE,
    // port: process.env.MYSQL_PORT, // thay đổi port kết nối tới MySQL từ 8080 thành 3307
    // host: process.env.MYSQL_HOST,

    dialect: "mysql",
    pool: {
      max: 5,
      min: 1,
      acquire: 30000,
      idle: 10000,
    },
  },
  secretKeyJWT: "asdsadsanmdnNHandas@_1212$#*&^",
  secretKeyRFT: "hjnnugahsbxhvsabdsavcash@#65565_*&^%#$",
};

module.exports = config;
