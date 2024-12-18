# LMS

## Description

This is simple LMS application that allows students to select courses and view their selected courses on the dashboard. And Admin can do all the CRUD operation.

## Table of Contents


- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Routes](#routes)
  - [User Routes](#user-routes)
  - [Course Routes](#course-routes)
  - [Lecture Routes](#lecture-routes)



## Features

- Admin Can Create/Update/Delete Course/Lecture and update or delete student profile
- Students can Select  courses And See the Lecture


## Technologies Used

- Node.js
- Express.js
- MongoDB
- ReactJs


## Installation

  ### For Backend

   1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/lms.git
    cd backend
    ```

  2. Install dependencies:

    ```bash
    npm install
    ```

  3. Set up your MongoDB connection by creating a `.env` file in the backend directory with the following content:

    ```env
    MongoURL=your-mongodb-connection-string
    
  

  4. Run the application:

    ```bash
    npm run server
    ```

  The server will be running on http://localhost:8080 by default.


 ### For Frontend
 
   1. Navigate to the frontend directory:

    ```bash
    cd frontend
    ```
    
  2. Install dependencies:

    ```bash
    npm install
    ```
    
   3. Start the frontend application:
    
    ```bash
    npm start
    ```
    
   The frontend will be running on http://localhost:3000.


   This will launch the application in your default web browser.


## Routes


### User Routes

| Method | Endpoint             | Description              | Authentication Required  |
| ------ | ---------------------| ------------------------ | ------------------------ |
| POST   | `/user/register`     | Create a new user        | No                       |
| POST   | `/user/login`        | Log in an existing user  | No                       |
| POST   | `/user/logout`       | Log out a user           | Yes                      |
| POST   | `/user/add-courses/` | Add 3 Course              | Yes                     |
| GET    | `/user/getcourses/`  | Get all cousres Selected by user   | Yes            |
| GET    | `/user/all           | Fetch all user            |  Yes




### Course Routes

| Method | Endpoint             | Description              | Authentication Required  |
| ------ | ---------------------| ------------------------ | ------------------------ |
| POST   | `/lecture/create`     | Add a new Course          | 	Yes (Admin)             |
| GET    | `/course/getAllCourse`       | 	Get all Course | Yes                      |
| GET    | `/course/:id`       | Get a specific Course     | Yes                  |
| GET    | `/course/:id/lectures`       | Get all the lecture inside that course     | Yes                  |
| PUT    | `/course/update/:id`     | 	Update a Course        | 	Yes (Admin)             |
| DELETE | `/course/delete/:id`       | 	Delete a Course | Yes (Admin)                      |


### Lecture Routes

| Method | Endpoint             | Description              | Authentication Required  |
| ------ | ---------------------| ------------------------ | ------------------------ |
| POST   | `/lecture/create`     | Add a new Lecture          | 	Yes (Admin)             |
| GET    | `/lecture/`       | 	Get all Lecture | Yes                      |
| GET    | `/lecture/:id`       | Get a specific Lecture     | Yes                  |
| PUT    | `/lecture/update/:id`     | 	Update a Lecture        | 	Yes (Admin)             |
| DELETE | `/lecture/delete/:id`       | 	Delete a Lecture | Yes (Admin)                      |



## Admin Credentials

To access the admin features of this project, please use the following credentials:

- **Email:** testing@gmail.com
- **Password:** 12345
