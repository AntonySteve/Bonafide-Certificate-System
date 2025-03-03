import mongoose from "mongoose";

const inchargeSchema = new mongoose.Schema({
    studentName : {
            type: String,
            required: true
    },
    regNo : {
            type: String,
            required: true,
            unique: true
    },
    inchargeName:{
            type: String,
            required: true
    },
    inchargeEmail : {
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
    }, { timestamps: true}
);

const Incharge = mongoose.models.Incharge || mongoose.model('Incharge', inchargeSchema);

export default Incharge