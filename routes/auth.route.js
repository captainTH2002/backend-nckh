const Route = require("express").Router()
const controller = require("../controller/user.controller")
const tryCatch = require("../middleware/tryCatch")
Route.post("/login", tryCatch(controller.login))
Route.post("/change-password", tryCatch(controller.changePassowrd))
Route.post("/register", tryCatch(controller.register))
Route.post("/refresh", tryCatch(controller.refreshToken))

module.exports = Route