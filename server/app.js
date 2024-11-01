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
// Get all cohorts
app.get("/api/cohorts", async (request, response) => {
  try {
    const cohorts = await Cohort.find({});
    response.status(200).json(cohorts);
  } catch (error) {
    response.status(500).json({ message: "Something went wrong" });
  }
});

//Get all students
app.get("/api/students", async (request, response) => {
  try {
    const students = await Student.find({});
    response.status(200).json(students);
  } catch (error) {
    response.status(500).json({ message: "Something went wrong" });
  }
});

//Get specific student
app.get("/api/students/:studentId", async (request, response) => {
  const { studentId } = request.params;
  try {
    const foundStudent = await Student.find({ _id: studentId });
    response.json(foundStudent);
  } catch (error) {
    response.json({ message: "Student with this id not found" });
  }
});

//Get specific cohort
app.get("/api/cohorts/:cohortId", async (request, response) => {
  const { cohortId } = request.params;
  try {
    const foundCohort = await Cohort.find({ _id: cohortId });
    response.json(foundCohort);
  } catch (error) {
    response.json({ message: "Cohort with this id not found" });
  }
});

//Get students with same cohortId
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
// Create student
app.post("/api/students", async (request, response) => {
  try {
    const createdStudent = await Student.create({ ...request.body });
    response.status(201).json(createdStudent);
  } catch (error) {
    response.status(500).json({ error: "Failed to create Student." });
  }
});

//Create cohort
app.post("/api/cohorts", async (request, response) => {
  try {
    const cohort = await Cohort.create({ ...request.body });
    response.status(201).json(cohort);
  } catch (error) {
    response.status(500).json({ error: "Failed to create Cohort." });
  }
});

//PUT Requests

//Update student
app.put("/api/students/:studentId", async (request, response) => {
  const { studentId } = request.params;
  try {
    const student = await Student.findByIdAndUpdate(
      { _id: studentId },
      request.body,
      { new: true }
    );
    response.status(200).json(student);
  } catch (error) {
    response.status(500).json({ error: "Failed to update student." });
  }
});

//Update cohort
app.put("/api/cohorts/:cohortId", async (request, response) => {
  const { cohortId } = request.params;
  try {
    const cohort = await Cohort.findByIdAndUpdate(
      { _id: cohortId },
      request.body,
      { new: true }
    );
    response.status(200).json(cohort);
  } catch (error) {
    response.status(500).json({ error: "Failed to update cohort." });
  }
});

//DELETE Requests

//Delete student
app.delete("/api/students/:studentId", async (request, response) => {
  const { studentId } = request.params;
  try {
    await Student.findByIdAndDelete({ _id: studentId });
    response.status(204).send();
  } catch (error) {
    response.status(500).json({ message: "Something went wrong." });
  }
});

app.delete("/api/cohorts/:cohortId", async (request, response) => {
  const { cohortId } = request.params;
  try {
    await Cohort.findByIdAndDelete({ _id: cohortId });
    response.status(204).send();
  } catch (error) {
    response(500).json({ message: "Something went wrong" });
  }
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
