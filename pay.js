// const paypal=require('paypal-rest-sdk');
// const{PAYPAL_MODE,PAYPAL_CLIENT_KEY,PAYPAL_SECRET_KEY}=file.env;
// paypal.configure({
//     'mode':PAYPAL_MODE,
//     'client_id':PAYPAL_CLIENT_KEY,
//     'client_secret':PAYPAL_SECRET_KEY
// })
// require('dotenv').config();
// const paypal = require('paypal-rest-sdk');

// paypal.configure({
//     'mode': process.env.PAYPAL_MODE, // 'sandbox' or 'live'
//     'client_id': process.env.PAYPAL_CLIENT_KEY,
//     'client_secret': process.env.PAYPAL_SECRET_KEY
// });
// Load environment variables
// require('dotenv').config();

// // Import PayPal SDK
// const paypal = require('paypal-rest-sdk');

// // Check if required environment variables are present
// const requiredEnvVars = ['PAYPAL_MODE', 'PAYPAL_CLIENT_KEY', 'PAYPAL_SECRET_KEY'];
// const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);

// if (missingVars.length > 0) {
//   throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
// }

// // Validate mode value
// if (!['sandbox', 'live'].includes(process.env.PAYPAL_MODE)) {
//   throw new Error('PAYPAL_MODE must be either "sandbox" or "live"');
// }

// // Configure PayPal SDK
// paypal.configure({
//   'mode': process.env.PAYPAL_MODE,
//   'client_id': process.env.PAYPAL_CLIENT_KEY,
//   'client_secret': process.env.PAYPAL_SECRET_KEY
// });

// // Optional: Add a simple test to verify configuration
// function verifyPayPalConnection() {
//   return new Promise((resolve, reject) => {
//     paypal.auth.tokeninfo.create('invalid-token', (error) => {
//       // We expect an error with invalid token, but it should be an auth error
//       // This confirms the SDK can reach PayPal's API
//       if (error && error.httpStatusCode) {
//         console.log('PayPal connection verified');
//         resolve(true);
//       } else {
//         console.error('PayPal connection failed');
//         reject(new Error('Could not connect to PayPal API'));
//       }
//     });
//   });
// }

// module.exports = {
//   paypal,
//   verifyPayPalConnection
// };
require('dotenv').config();
const paypal = require('paypal-rest-sdk');

const requiredEnvVars = ['PAYPAL_MODE', 'PAYPAL_CLIENT_KEY', 'PAYPAL_SECRET_KEY'];
const missingVars = requiredEnvVars.filter((varName) => !process.env[varName]);

if (missingVars.length > 0) {
  throw new Error(`Missing required environment variables: ${missingVars.join(', ')}`);
}

if (!['sandbox', 'live'].includes(process.env.PAYPAL_MODE)) {
  throw new Error('PAYPAL_MODE must be either "sandbox" or "live"');
}

paypal.configure({
  mode: process.env.PAYPAL_MODE,
  client_id: process.env.PAYPAL_CLIENT_KEY,
  client_secret: process.env.PAYPAL_SECRET_KEY,
});

module.exports = { paypal };