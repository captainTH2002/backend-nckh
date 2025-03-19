const Route = require("express").Router()
const controller = require("../controller/admin.controller")
const tryCatch = require("../middleware/tryCatch")
Route.get("/", tryCatch(controller.listUsers))
Route.get("/:userId", tryCatch(controller.getDetail))
Route.post("/", tryCatch(controller.createUser))
Route.put("/:userId", tryCatch(controller.updateUser))
Route.delete("/:userId", tryCatch(controller.deleteUser))


module.exports = Route