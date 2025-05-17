// const mongoose = require('mongoose');

// const userSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   reset_token: { type: String },
//   reset_token_expires: { type: Date },
// }, { timestamps: true });

// module.exports = mongoose.model('User', userSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true, // Store emails in lowercase
    trim: true, // Remove whitespace
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'] // Basic email regex
  },
  password: {
    type: String,
    required: true,
    minlength: [5, 'Password must be at least 5 characters long']
  },
  reset_token: {
    type: String,
    index: true, // Add index for faster password reset queries
    sparse: true // Allow null values in the index
  },
  reset_token_expires: {
    type: Date,
    index: true, // Add index for faster expiration checks
    sparse: true
  }
}, {
  timestamps: true
});

// Ensure indexes are created
userSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model('User', userSchema);  

// const userSchema = new mongoose.Schema({
//   email: {
//     type: String,
//     required: true,
//     unique: true,
//     lowercase: true,
//     trim: true,
//     match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address']
//   },
//   password: {
//     type: String,
//     required: true,
//     minlength: [5, 'Password must be at least 5 characters long']
//   },
//   profileImage: {
//     type: String,
//     default: null
//   },
//   reset_token: { type: String, index: true, sparse: true },
//   reset_token_expires: { type: Date, index: true, sparse: true }
// }, { timestamps: true });

// userSchema.index({ email: 1 }, { unique: true });

// module.exports = mongoose.model('User', userSchema);