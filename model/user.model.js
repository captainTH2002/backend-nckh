const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const userSchema = new Schema(
    {
        userId: {type: String, required: true, unique: true},
        displayName: { type: String, required: true },
        username: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        role: { type: String, default: "U" },
        email: {type: String, required: true, unique: true},
        phonenumber: {type: String, default:null},
        refreshToken: { type: String, default: null },
    },
    {
        timestamps:true
    }
)

const Users = mongoose.model("users", userSchema)
module.exports = Users

