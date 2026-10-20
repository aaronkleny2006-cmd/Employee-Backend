// Task1: initiate app and run server at 3000
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const app = new express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const path=require('path');
app.use(express.static(path.join(__dirname+'/dist/FrontEnd')));

// Task2: create mongoDB connection 
require('dotenv').config();

const MONGO_URI = process.env.MONGO_URI 

mongoose.connect(MONGO_URI)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch((err) => console.log('MongoDB Connection Error:', err));
// Mongoose Schema & Model definition
const employeeSchema = new mongoose.Schema({
    name: String,
    location: String,
    position: String,
    salary: Number
});

const EmployeeData = mongoose.models.employeedata || mongoose.model('employeedata', employeeSchema);

//Task 2 : write api with error handling and appropriate api mentioned in the TODO below







//TODO: get data from db  using api '/api/employeelist'
app.get('/api/employeelist', async (req, res) => {
    try {
        const data = await EmployeeData.find();
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: "Error fetching employee list", error });
    }
})


//TODO: get single data from db  using api '/api/employeelist/:id'
app.get('/api/employeelist/:id', async (req, res) => {
    try {
        const data = await EmployeeData.findById(req.params.id);
        if (!data) {
            return res.status(404).send({ message: "Employee not found" });
        }
        res.status(200).send(data);
    } catch (error) {
        res.status(500).send({ message: "Error fetching employee", error });
    }
});


//TODO: send data from db using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.post('/api/employeelist', async (req, res) => {
    try {
        const newEmployee = new EmployeeData(req.body);
        const savedData = await newEmployee.save();
        res.status(201).send(savedData);
    } catch (error) {
        res.status(500).send({ message: "Error adding employee", error });
    }
})



//TODO: delete a employee data from db by using api '/api/employeelist/:id'
app.delete('/api/employeelist/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const deletedData = await EmployeeData.findByIdAndDelete(id);
        if (!deletedData) {
            return res.status(404).send({ message: "Employee not found" });
        }
        res.status(200).send({ message: "Employee deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting employee", error });
    }
});




//TODO: Update  a employee data from db by using api '/api/employeelist'
//Request body format:{name:'',location:'',position:'',salary:''}
app.put('/api/employeelist', async (req, res) => {
    try {
        const id = req.body._id || req.body.id;
        const updatedData = await EmployeeData.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        res.status(200).send(updatedData);
    } catch (error) {
        res.status(500).send({ message: "Error updating employee", error });
    }
});

//! dont delete this code. it connects the front end file.
app.get('/*', function (req, res) {
    res.sendFile(path.join(__dirname + '/dist/Frontend/index.html'));
});

// Run server at port 3000
app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

