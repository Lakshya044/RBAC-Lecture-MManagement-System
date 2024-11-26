const mongoose = require("mongoose")
const studentCourseSchema = mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    course: [ { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true }],
    isSelected: { type: Boolean, default: false } 
 },{
     versionKey:false
 });
 
 const StudentCourseModel = mongoose.model("Studentcourse", studentCourseSchema);
 
 module.exports = { StudentCourseModel };
 