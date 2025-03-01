import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
    studentName : {
        type: String,
        required: true
    },
    studentRegNo : {
        type: String,
        required: true,
        unique: true
    },
    tutorName:{
        type: String,
        required: true
    },
    tutorEmail : {
        type: String,
        required: true
    },
    unseen: {
        type: Boolean,
        
    }
})