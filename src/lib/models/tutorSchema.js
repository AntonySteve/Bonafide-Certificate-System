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
        default: false,
    },
    reason: {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    section: {
        type: String,
        required: true
    },
    yearIncharge: {
        type: String,
        required: true
    },
    department: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    }
}, {timestamps: true});

const Tutor = mongoose.models.Tutor || mongoose.model('Tutor', tutorSchema);

export default Tutor