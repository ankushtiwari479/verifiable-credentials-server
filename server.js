// Import required modules and libraries
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const pdfLib = require('pdf-lib');
const qrCode = require('qrcode');
const jwt = require('jsonwebtoken');
const cors = require('cors')
const db = require('./db/db.js');
const Credential = require('./db/models/Credential.js');
const app = express();
const Student = require('./db/models/Student.js');
const Admin = require('./db/models/Admin.js');
const config = require('./config.js');
const verifyToken = require('./middlewares/auth.js');
const Course = require('./db/models/Course.js');
const Enrollment = require('./db/models/Enrollment.js');
const { formatDate, generatePdf } = require('./util.js')
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors())


function generateJwtToken(user) {
    const jwtSecret = config.jwtSecret; 
    const jwtPayload = user; 
    const jwtOptions = { expiresIn: '1h' }; 
    return jwt.sign(jwtPayload, jwtSecret, jwtOptions);
  }

async function generateQRCode(url) {
    try {
      const qrCodeDataURL = await qrCode.toDataURL(url);
      const base64ImageData = qrCodeDataURL.split(',')[1];
      return base64ImageData;
    } catch (error) {
      console.error('Error generating QR code:', error);
      throw error;
    }
  }



app.post('/viewdoc/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let credential = await Credential.findOne({_id:id});
    let verificationUrl = `${process.env.FRONT_URL}/verifydoc/${id}`
    const imgCode = await generateQRCode(verificationUrl);
    const htmlTemplate =  generatePdf(credential,imgCode);
    res.status(200).json({credential:credential.toObject(),htmlTemplate})
  } catch (error) {
    console.error('Error verifying verifiable credential:', error);
    res.status(500).send('Internal Server Error');
  }
});


app.post('/verify/:id', async (req, res) => {
  try {
    const id = req.params.id;
    const { password } = req.body
    const admin = await Admin.findOne({ username:"admin", password });
    if(admin){
      let credential = await Credential.findOne({_id:id});
      let verificationUrl = `${process.env.FRONT_URL}/verifydoc/${id}`
      const imgCode = await generateQRCode(verificationUrl);
      const htmlTemplate = generatePdf(credential,imgCode);
      res.status(200).json({credential:credential.toObject(),htmlTemplate})
    }
    else{
      res.status(401).json({message:"not authorized"})
    }
  } catch (error) {
    console.error('Error verifying verifiable credential:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.post('/student/signup', async (req, res) => {
  try {
    const { name, email, password, rollNumber, selectedCourse } = req.body;
    const newStudent = new Student({ name, email, password, rollNumber,courseName:selectedCourse });
    await newStudent.save();
    const course = await Course.findOne({ name: selectedCourse });
    if (!course) {
      return res.status(404).json({ error: 'Selected course not found' });
    }
    const enrollment = new Enrollment({ student: newStudent._id, course: course._id });
    await enrollment.save();
    res.status(200).json({ message: 'Student signed up successfully',token:generateJwtToken(newStudent.toObject()) });
  } catch (error) {
    console.error('Error signing up student:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

  app.post('/student/login', async (req, res) => {
    try {
      const { email, password } = req.body;
      console.log(req.body)
      const student = await Student.findOne({ email, password });
      console.log(student)
      if (!student) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      const token = generateJwtToken(student.toObject());
      res.status(200).json({ message: 'Student logged in successfully', token });
    } catch (error) {
      console.error('Error logging in student:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.post('/enrollment/mark-completed', verifyToken, async (req, res) => {
    try {
      const { enrollmentId,courseId } = req.body;
      const enrollment = await Enrollment.findById(enrollmentId);
      if (!enrollment) {
        return res.status(404).json({ error: 'Enrollment not found' });
      }
      if(!enrollment.completed){
        enrollment.completed = true;
        await enrollment.save();
        const credential = new Credential({
          issuerName: "TechEd Academy",
          studentDetails: req.user._id,
          courseDetails: courseId,
          enrollmentDetails:enrollmentId,
        })
        credential.save();
      }
      
      res.status(200).json({ message: 'Enrollment marked as completed' });
    } catch (error) {
      console.error('Error marking enrollment as completed:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

   app.get('/course/getlist',async (req,res)=>{
    let courseData = await Course.find({});
    res.json(courseData)
  })

  app.get('/student/details',verifyToken, async (req,res)=>{
    console.log(req?.user?._id)
    const enrollment = await Enrollment.findOne({ student: req.user._id });
    console.log("enrollment---",enrollment)
    let credential = null;
    if(enrollment){
      credential = await Credential.findOne({enrollmentDetails:enrollment._id})
    }
    res.status(200).json({user:req.user,enrollment,certificate:credential})
  })

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
