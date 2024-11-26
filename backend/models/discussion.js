const mongoose = require("mongoose")
const discussionSchema = mongoose.Schema({
    lecture: { type: mongoose.Schema.Types.ObjectId, ref: 'Lecture', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
 },{
     versionKey:false
 });
 
 const DiscussionModel = mongoose.model("Discussion", discussionSchema);
 
 module.exports = { DiscussionModel };
 