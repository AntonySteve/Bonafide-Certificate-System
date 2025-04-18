import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  acceptedRequests: {
    type: [{
      studentName: { type: String, required: true },
      studentRegNo: { type: String, required: true },
      tutorName: {type: String},
      inchargeName: {type: String},
      reason: { type: String, required: true },
      acceptedAt: { type: Date, default: Date.now }
    }],
    default: []  
  },

  rejectedRequests: {
    type: [{
      studentName: { type: String, required: true },
      studentRegNo: { type: String, required: true },
      tutorName: {type: String},
      inchargeName: {type: String},
      reason: { type: String, required: true },
      rejectedAt: { type: Date, default: Date.now }
    }],
    default: []  
  }

}, { timestamps: true });

const User = mongoose.models.User || mongoose.model('User', userSchema);

export default User;
