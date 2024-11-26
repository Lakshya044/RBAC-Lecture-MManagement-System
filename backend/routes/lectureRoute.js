const express = require("express");
const {role} = require("../middleware/roleMiddleware");
const { LectureModel } = require("../models/lecture");
const { CourseModel } = require("../models/course");
const { auth } = require("../middleware/authMiddleware");
const lectureRoute = express.Router();



lectureRoute.post("/create", auth ,role(["Admin"]),async(req,res)=>{

    try {
        const newLecture = await LectureModel.create(req.body);
        await newLecture.save()

         // Add lecture ID to the course
         const course = await CourseModel.findById(req.body.course);
         if (!course) {
             return res.status(404).json({ message: 'Course not found' });
         }
         if (course.lectures.includes(newLecture._id)) {
             return res.status(400).json({ message: 'Lecture already added to the course' });
         }
         course.lectures.push(newLecture._id);
         await course.save();

        res.status(201).send({message:"Lecture Created",newLecture});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
})

lectureRoute.get('/',auth ,async (req, res) => {
    try {
        const lectures = await LectureModel.find();
        res.status(201).send({lectures});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

lectureRoute.get('/:id', auth , async (req, res) => {
    try {
        const lecture = await LectureModel.findById(req.params.id);
        if (!lecture) {
            return res.status(404).send({ message: 'Lecture not found' });
        }
        res.status(201).send(lecture);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


lectureRoute.put('/:id',auth ,role(["Admin"]) ,async (req, res) => {
    try {
        const updatedLecture = await LectureModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedLecture) {
            return res.status(404).send({ message: 'Lecture not found' });
        }
        res.status(201).send({message:"Lecture Updated",updatedLecture});
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

lectureRoute.delete('/:id', auth ,role(["Admin"]) ,  async (req, res) => {
    try {
        const deletedLecture = await LectureModel.findByIdAndDelete(req.params.id);
        if (!deletedLecture) {
            return res.status(404).send({ message: 'Lecture not found' });
        }
        const course = await CourseModel.findOneAndUpdate(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } },
            { new: true }
        );

        res.status(201).send({ message: 'Lecture deleted successfully' });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});


module.exports={lectureRoute}