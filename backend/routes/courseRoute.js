const express = require("express");
const {role} = require("../middleware/roleMiddleware");
const { CourseModel } = require("../models/course");
const { auth } = require("../middleware/authMiddleware");
const { UserModel } = require("../models/user");
const { LectureModel } = require("../models/lecture");
const cousreRoute = express.Router();

cousreRoute.post("/create" , auth ,role(["Admin"]),async(req,res)=>{

    try {
         const course = await CourseModel.findOne({name:req.body.name});
         if (course) {
             return res.status(404).send({ message: 'Course already There' });
         }
         const newCourse = await CourseModel.create(req.body);
         await newCourse.save()

        res.status(201).send({message:"Course Created",newCourse});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

cousreRoute.get('/getAllCourse', auth, async (req, res) => {
    try {
        const courses = await CourseModel.find();
        const totalCourse = courses.length
        res.status(201).send({courses:courses ,total : totalCourse});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

cousreRoute.get('/:id', auth , async (req, res) => {
    try {
        const course = await CourseModel.findById(req.params.id);
        if (!course) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.status(201).send({course});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

cousreRoute.get("/:id/lectures" , auth , async(req,res)=>{
    try {

    const courseId = req.params.id;
    const course = await CourseModel.findById(courseId).populate("lectures");
    
    if (!course) {
      return res.status(404).send({ message: "Course not found" });
    }
    
    res.status(201).send({message:"lecture",lectures:course.lectures});

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

cousreRoute.put('/:id',auth ,role(["Admin"]) ,async (req, res) => {
    try {
        const updatedCourse = await CourseModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedCourse) {
            return res.status(404).send({ message: 'Course not found' });
        }
        res.status(201).send({message:"Course Updated",updatedCourse});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

cousreRoute.delete('/:id', auth ,role(["Admin"]) ,async (req, res) => {
    try {
        const deletedCourse = await CourseModel.findByIdAndDelete(req.params.id);
        if (!deletedCourse) {
            return res.status(404).send({ message: 'Course not found' });
        }
        await LectureModel.deleteMany({ course: courseId });
        await UserModel.updateMany({}, { $pull: { course: courseId } });
        res.status(201).send({ message: 'Course deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


module.exports={cousreRoute}