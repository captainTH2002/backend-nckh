const mongoose = require("mongoose")
const Schema = mongoose.Schema;

const post2Schema = new Schema(
    {
        postId: {type: String, required: true, unique: true},
        title: { type: String , default: null},
        content: {type: String, default: null},
        author: {type: String, default: null},
        url: {type: String, default: null}, 
        images:[{type:String, default:null}],
        videos:[{type: String, default: null}],
        sensetive: {type: Number, default: 0}
    },
    {
        timestamps:true
    }
)

const Posts2 = mongoose.model("post2", post2Schema)
module.exports = Posts2