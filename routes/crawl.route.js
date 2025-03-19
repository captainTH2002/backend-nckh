const Route = require("express").Router()
const controller = require("../controller/crawl.controller")
const tryCatch = require("../middleware/tryCatch")
Route.get("/", tryCatch(controller.getWebsite))
Route.get("/test", tryCatch(controller.testWebsite))

module.exports = Route