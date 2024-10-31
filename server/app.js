const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const Cohort = require("../server/models/Cohort.model");
const Student = require("../server/models/Student.model");
const PORT = 5005;

mongoose
  .connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then((x) =>
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  )
  .catch((err) => console.error("Error connecting to mongo", err));

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...
const cohortsData = require("../server/cohorts.json");
const studentsData = require("../server/students.json");

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

//GET Requests
app.get("/api/cohorts", (request, response) => {
  Cohort.find({})
    .then((cohorts) => {
      response.status(200).json(cohorts);
    })
    .catch((error) => {
      res.status(500).json({ message: "Something went wrong" });
    });
});

app.get("/api/students", (request, response) => {
  Student.find({})
    .then((students) => {
      response.status(200).json(students);
    })
    .catch((error) => {
      response.status(500).json({ message: "Something went wrong." });
    });
});

app.get("/api/students/:studentId", async (request, response) => {
  const { studentId } = request.params;
  try {
    const foundStudent = await Student.find({ _id: studentId });
    response.json(foundStudent);
  } catch (error) {
    response.json({ message: "Student with this id not found" });
  }
});

app.get("/api/students/cohort/:cohortId", async (request, response) => {
  const { cohortId } = request.params;
  try {
    const foundStudents = await Student.find({ cohort: cohortId });
    response.json(foundStudents);
  } catch (error) {
    response.json({ message: "Something went wrong." });
  }
});

//POST Requests
app.post("/api/students", (request, response) => {
  const createdStudent = Student.create({
    ...request.body,
  })
    .then((createdStudent) => {
      response.status(201).json(createdStudent);
    })
    .catch((error) => {
      response.status(500).json({ error: "Failed to create Student." });
    });
});

//PUT Requests

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
