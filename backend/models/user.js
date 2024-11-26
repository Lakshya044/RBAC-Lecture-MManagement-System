const mongoose = require("mongoose")


const userSchema = mongoose.Schema({
   email:{ type: String, required: true },
   password : { type: String, required: true },
   role: {type : String , enum:["Admin","Student"] , default:"Student"},
   isLoggedIn: { type: Boolean, default: false },
   course: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }],
   isSelected: { type: Boolean, default: false } 


},{
    versionKey:false
})

const UserModel = mongoose.model("User" , userSchema)

module.exports={UserModel}