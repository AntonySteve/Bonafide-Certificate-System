import mongoose from "mongoose";

const inchargeSchema = new mongoose.Schema({
    studentName : {
        type: String,
        required: true
    },
    studentRegNo:{
        type: String,
        required: true,
    },
    studentEmail : {
        type: String,
        required: true
    },
    year: {
        type: String,
        required: true
    },
    academicYear: {
        type: String,
        required: true
    },
    tutorName: {
        type: String,
        required: true
    },
    inchargeName:{
            type: String,
            required: true                      
    },
    inchargeEmail : {
            type: String,
            required: true
    },
    reason: {
            type: String,
            required: true
    },
    fatherName: {
            type: String,
            required: true
    }, 
},{ timestamps: true}
);


const Incharge = mongoose.models.Incharge || mongoose.model('Incharge', inchargeSchema);

export default Incharge