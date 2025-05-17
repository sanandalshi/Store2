// const mysql=require('mysql2');
// const pool=mysql.createPool({
// host:'localhost',
// user:'root',
// database:'node-complete',
// password:'Wj28@krhps'



// });
// module.exports=pool.promise();
// require('dotenv').config();
// const mysql = require('mysql2');

// const pool = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   database: process.env.DB_DATABASE,
//   password: process.env.DB_PASSWORD
// });

// module.exports = pool.promise();
// require('dotenv').config();
// const mongoose = require('mongoose');

// const connectDB = async () => {
//   try {
//     await mongoose.connect(process.env.MONGO_URI, {
//       useNewUrlParser: true,
//       useUnifiedTopology: true,
//     });
//     console.log('MongoDB connected successfully');
//   } catch (error) {
//     console.error('MongoDB connection error:', error);
//     process.exit(1);
//   }
// };

// module.exports = connectDB;
require('dotenv').config();
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Set strictQuery to suppress deprecation warning
    mongoose.set('strictQuery', true);

    await mongoose.connect(process.env.MONGO_URI, {
      // Removed deprecated options (optional, keep if using Mongoose 6.x)
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    // Retry connection after 5 seconds (optional, for production)
    console.log('Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
    // Optionally, keep process.exit(1) for development
    // process.exit(1);
  }
};

module.exports = connectDB;