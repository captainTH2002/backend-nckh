const adminRoute = require("./admin.route")
const crawlRoute = require("./crawl.route")
const authRoute = require("./auth.route")
const postRoute = require("./post.route")
const route = (app) => {
  app.use("/api/crawl", crawlRoute)
  app.use("/api/admin", adminRoute)
  app.use("/api/auth", authRoute)
  app.use("/api/post", postRoute)
  

  
};
module.exports = route;
