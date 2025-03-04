import mongoose from "mongoose";

const hodSchema = new mongoose.Schema({
    studentName : {
        type: String,
        required: true
    },
    studentRegNo : {
        type: String,
        required: true, 
    },
    studentEmail : {
        type: String,
        required: true
    },
    tutorName:{
        type: String,
        required: true
    },
    inchargeName: {
        type: String,
        required: true
    },
    reason: {
        type: String,
        required: true
    }
}, { timestamps: true})

const Hod = mongoose.models.Hod || mongoose.model('Hod', hodSchema);

export default Hod;