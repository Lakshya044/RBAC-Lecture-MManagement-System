const express = require("express");
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user");
const { auth } = require("../middleware/authMiddleware");
const {CourseModel} = require("../models/course")
const {role} = require("../middleware/roleMiddleware");

require('dotenv').config();
const userRoute = express.Router();



// employee register route
userRoute.post("/register", async(req,res)=>{
    const { email, password} = req.body;

    try {
        const user = await UserModel.findOne({ email });

        // Check if user already exists

        if (user) {
            return res.status(400).send({ "message": "User Already Present With this Email" });
        }

        // Hashing the password before saving to the database
        bcrypt.hash(password, 5, async (err, hash) => {
            if (err) {
                return res.status(500).send({ "message": "Error hashing password" });
            }

            // Creating a new user instance

            const newUser = new UserModel({
                email,
                password: hash
            });

            // Saving the new user to the database

            await newUser.save();
            res.status(200).send({ message: "Registration successful" });
        });
    } catch (error) {
        res.status(500).send({ "message": error.message });
    }
});

// employee login route
userRoute.post("/login", async (req, res) => {
  // Extracting login credentials from request body
  const { email, password } = req.body;

  try {
      const user = await UserModel.findOne({ email });

      if (!user) {
          return res.status(400).send({ "message": "Incorrect email or password, please try again." });
      }

      // Comparing the hashed password
      const result = await bcrypt.compare(password, user.password);
      
      if (result) {
          user.isLoggedIn = true; // Set login status if needed
          await user.save();
          
          // Creating a JWT token upon successful login
          const token = jwt.sign({ userId: user._id, userRole: user.role , }, process.env.secretKey, { expiresIn: '1h' }); // Optionally, set an expiration for the token
          return res.status(200).send({ "message": "Login Successful", user, token });
      } else {
          return res.status(400).send({ "message": "Incorrect email or password, please try again." });
      }

  } catch (error) {
      console.error("Login error: ", error);
      return res.status(500).send({ "message": "An error occurred during login. Please try again later." });
  }
});

userRoute.post('/logout', auth ,async (req, res) => {
    try {
      // Find the user by ID
      const user = await UserModel.findById(req.body.userId);
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      // Update isLoggedIn field to false
      user.isLoggedIn = false;
      await user.save();
  
      res.status(200).send({ message: 'Logout successful' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send({ message: 'Server Error' });
    }
  });

  userRoute.post('/add-courses/',auth , async (req, res) => {
    const { userId } = req.body;
    const { courseIds } = req.body; 
  
    try {
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      // Assuming courseIds is an array containing three course ids
      user.course.push(...courseIds);
      user.isSelected = true
      await user.save();
  
      res.status(200).send({ message: 'Courses added successfully' });
    } catch (error) {
      console.error('Error adding courses:', error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });

  userRoute.get('/getcourses/',auth ,  async (req, res) => {
    const { userId } = req.body;
   
  
    try {
      const user = await UserModel.findById(userId);
  
      if (!user) {
        return res.status(404).send({ message: 'User not found' });
      }
  
      
   
  
      res.status(200).send({ message: 'Courses Found successfully' , courses : user.course });
    } catch (error) {

      res.status(500).send({ message: 'Internal server error' });
    }
  });

  userRoute.post('/check', auth, async (req, res) => {
    try {
      const { userId } = req.body;
      console.log("userId", userId);
  
      if (!userId) {
        return res.status(400).send({ message: "User ID is required." });
      }
  
      const user = await UserModel.findById(userId);
      console.log("user", user);
  
      if (!user) {
        return res.status(404).send({ message: "User not found." });
      }
  
      let courses = [];
      if (user.isSelected) {
        // Fetch the course details by course IDs
        for (let courseId of user.course) {
          const course = await CourseModel.findById(courseId);
          if (course) {
            courses.push(course);
          }
        }
      }
     console.log("courses",courses)
      res.status(200).send({
        isSelected: user.isSelected,
        courses: courses,
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).send({ message: "Internal server error." });
    }
  });
  
  userRoute.get('/all', auth, role(["Admin"]), async (req, res) => {
    try {
      const students = await UserModel.find({ role: 'Student' });
      console.log("students",students);
      if (students.length === 0) {
        return res.status(404).send({ message: 'No students found.' });
      }
      res.status(200).send({ message: 'Students fetched successfully', students });
    } catch (error) {
      console.error("Error fetching students:", error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });
   
  userRoute.put('/:userId', auth, role(["Admin"]), async (req, res) => {
    const { userId } = req.params;
    const updatedData = req.body; // The data you want to update
  
    try {
      // Find the user by ID and update it
      const user = await UserModel.findByIdAndUpdate(userId, updatedData, {
        new: true, // Return the updated user
        runValidators: true, // Ensure validation is applied when updating
      });
  
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }
  
      res.status(200).send({ message: 'User updated successfully', user });
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });
  
  // Delete user by ID
  userRoute.delete('/:userId', auth, role(["Admin"]), async (req, res) => {
    const { userId } = req.params;
  
    try {
      // Find and delete the user by ID
      const user = await UserModel.findByIdAndDelete(userId);
  
      if (!user) {
        return res.status(404).send({ message: 'User not found.' });
      }
  
      res.status(200).send({ message: 'User deleted successfully' });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).send({ message: 'Internal server error' });
    }
  });
  
module.exports = {userRoute}