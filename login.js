// let express=require('express');
// let route=express.Router();
// let p=require('path');
// let isauth=require('./midleware/isauth');
// const bcrypt=require('bcryptjs');
// let db=require('./util/database');
// const flash = require('connect-flash');
// const crypto=require('crypto');
// const d = require('./models/cart');
// require('dotenv').config();
// const {check, validationResult}=require('express-validator');
// const nodemailer = require('nodemailer');
// function removeTrailingSlash(str) {
//     return str.replace(/\/$/, '');
// }
// const paypal=require('paypal-rest-sdk');


// paypal.configure({
//     'mode':"sandbox",
//     'client_id':"AfJGBZNC7KDT9iK46PEXqARVygVj4fUnc1ZO0TxCDbvC1PnoP4MyBg-XglNCUc_W3EOO2fOR9byayZpf",
//     'client_secret':"ELnKsOjCpmAQC4boGaHzP0AIneV4L5QkMwCbOD0OdysOTuTxFWOsjTxrWmVt9OIPSAJPe3Bx-VFeSJxH"
// });
// let transport = nodemailer.createTransport({
//     service:"gmail",
//      port: 465,
//      secure: true,
//      auth: {
//      user:"sanand.alshi@gmail.com",
//        pass: "dpba pvwk psue eelk"
//      }
//    });

// route.get('/login',(req,res)=>{
 
// res.render('auth',{message:req.flash('error'),err:req.flash('err')});
// });


// route.post('/loogin',[check('email').isEmail().withMessage('the email is invalid!'),check('password','Invalid password!').isLength({min:5}).isAlphanumeric()] ,async (req, res) => {
//     const { email, password } = req.body;
// let error=validationResult(req);
// if(!error.isEmpty()){
//     let ans=error.array()[0].msg;
//     req.flash('err',ans);
//     res.status(422).redirect('/login');
//     return;
// }
//     try {
//         const [rows] = await db.execute('SELECT * FROM user2 WHERE email = ?', [email]);

//         let ans = false;
        
//         for (let row of rows) {
//             let match = await bcrypt.compare(password, row.password);
//             if (row.email === email && match) {
//                 ans = true;
//                 break;
//             }
//         }

//         if (ans) {
//             req.session.loggedin = true;
//             res.redirect('/');
//         } else {
//            req.flash('error','invalid email or password!');
//            res.redirect('./login');
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).send('<h1>Server Error</h1>');
//     }
// });

// route.use('/reset',(req,res,next)=>{
// let message=req.flash('error');

// res.render('reset',{message});
// });


// route.use('/resetpass/:token', async (req, res, next) => {
//     let token = req.params.token;

  
//         const [rows] = await db.execute('SELECT * FROM user2 WHERE reset_token = ? AND reset_token_expires > ?', [token, new Date()]);
//         let email="abc.alshi@gmail.com";
//         rows.forEach(row=>{
//             if(row.reset_token==token&&row.reset_token_expires > new Date()){
//                 email=row.email;
//             };
//         });
//         if (rows.length === 0) {
//             // Token is invalid or expired
//             req.flash('error', 'Invalid or expired token');
//             return res.redirect('/');
//         } else {
           
//            console.log(email);
//             return res.render('karoab', { token ,email});
//         }
   
// });

// route.post('/password',async(req,res)=>{
//     let email=removeTrailingSlash(req.body.email);
//     let npass= await bcrypt.hash(req.body.password,12);
//     // console.log(email);
//     // console.log(npass);
//     await db.execute('UPDATE user2 SET password = ? WHERE email = ?', [npass, email])
//     .then(result=>{
//     console.log('ho gaya!');
// res.redirect('/');
//   }).catch(err=>{
//     console.log(err);
//   })



// })
// route.post('/password',async(req,res)=>{
//     let email=removeTrailingSlash(req.body.email);
//     let npass= await bcrypt.hash(req.body.password,12);
//     // console.log(email);
//     // console.log(npass);
//     await db.execute('UPDATE user2 SET password = ? WHERE email = ?', [npass, email])
//     .then(result=>{
//     console.log('ho gaya!');
// res.redirect('/');
//   }).catch(err=>{
//     console.log(err);
//   })



// })
// route.post('/reset-auth', async(req,res)=>{
//     let email=req.body.email;
    
//     const token = crypto.randomBytes(20).toString('hex');
//     const expires = new Date(Date.now() + 3600000); 
// await db.execute('select *from user2').then(([rows,feild])=>{
//     let ans=false;
//     rows.forEach  (row=>{
//         if(row.email==email){
//             ans=true;
//         }
//     });
// if(ans==true){
//     db.execute('UPDATE user2 SET reset_token = ?, reset_token_expires = ? WHERE email = ?', [token, expires, email]);
//     res.redirect('/');
//     transport.sendMail({
//         to:email,
//         from:"sanand.alshi@gmail.com",
//         subject:"RESET-PASSWORD",
//         html:`<p>YOU AREQUESTED FOR CHANGING THE PASSWORD</P>
//         <P>PLEASE CLICK ON THE LINK <a href="http://localhost:8080/resetpass/${token}">CHANGE-PASSWORD</a>TO CHANGE THE PASSWORD</p>
//         `
//     });
// }
// else{
//     req.flash('error','the user does not exists');
//     res.redirect('/reset');
// }






// })




// });

// route.post('/splice',(req,res,next)=>{
// let id=req.body.id;
// let ans=-1;
// for(let i=0;i<d.arr.length;i++){
//     if(d.arr[i].id==id){
//         if(d.arr[i].quan>1){
//         d.arr[i].quan--;res.redirect('/cartarray');return;}else{
//             d.arr.splice(1,i);
//             res.redirect('/cartarray');
//             return;
//         }
//         break;
//     }
// }


// });


// // route.post('/pay',async(req,res,next)=>{
// //     try {
// //         const total = parseInt(req.body.amount);
// // console.log(total);
// //         // Validate total
// //         if (isNaN(total) || total <= 0) {
// //             return res.status(400).json({ error: 'Invalid total amount' });
// //         }

// //         const create_payment_json = {
// //             "intent": "sale",
// //             "payer": {
// //                 "payment_method": "paypal"
// //             },
// //             "redirect_urls": {
// //                 "return_url": "http://localhost:8080/success",
// //                 "cancel_url": "http://localhost:8080/cancel"
// //             },
// //             "transactions": [{
// //                 "item_list": {
// //                     "items": [{
// //                         "name": "Book",
// //                         "sku": "001",
// //                         "price": total, // Ensure two decimal places
// //                         "currency": "USD",
// //                         "quantity": 1
// //                     }]
// //                 },
// //                 "amount": {
// //                     "currency": "USD",
// //                     "total": total // Ensure two decimal places
// //                 },
// //                 "description": "Thanks for paying with us"
// //             }]
// //         };

// //         // Promisify paypal.payment.create
// //         const createPayment = () => {
// //             return new Promise((resolve, reject) => {
// //                 paypal.payment.create(create_payment_json, (error, payment) => {
// //                     if (error) {
// //                         return reject(error);
// //                     } 
// //                     return resolve(payment);
// //                 });
// //             });
// //         };

     
// //         const payment = await createPayment();

// //         const approvalUrl = payment.links.find(link => link.rel === 'approval_url');

// //         if (approvalUrl) {
// //             return res.redirect(approvalUrl.href);
// //         } else {
// //             return res.status(500).json({ error: 'Approval URL not found' });
// //         }
        
// //     } catch (error) {
// //         console.error('Error creating PayPal payment:', error);
// //         return res.status(500).json({ error: 'An error occurred while processing your payment' });
// //     }
// // });


// route.post('/pay', async(req, res, next) => {
//     try {
//       // Get total amount
//       const total = parseInt(req.body.amount);
//       console.log('Payment amount:', total);
      
//       // Basic validation
//       if (isNaN(total) || total <= 0) {
//         return res.status(400).json({ error: 'Invalid total amount' });
//       }
      
//       // Create simplified payment JSON
//       const create_payment_json = {
//         "intent": "sale",
//         "payer": {
//             "payment_method": "paypal"
//         },
//         "redirect_urls": {
//             // Use environment variable for host URL to make it deployment-ready
//             "return_url": `${process.env.HOST_URL || 'http://localhost:8080'}/success`,
//             "cancel_url": `${process.env.HOST_URL || 'http://localhost:8080'}/cancel`
//         },
//         "transactions": [{
//             "item_list": {
//                 "items": [{
//                     "name": "Book Purchase",
//                     "sku": "BOOK-001",
//                     "price": total.toFixed(2),
//                     "currency": "USD",
//                     "quantity": 1
//                 }]
//             },
//             "amount": {
//                 "currency": "USD",
//                 "total": total.toFixed(2)
//             },
//             "description": "Book Shop Purchase"
//         }]
//       };
      
//       // Create PayPal payment with proper error handling
//       paypal.payment.create(create_payment_json, (error, payment) => {
//         if (error) {
//           console.error('PayPal Error:', error);
//           return res.status(500).render('error', {
//             message: 'Payment service temporarily unavailable',
//             error: process.env.NODE_ENV === 'development' ? error : {}
//           });
//         }
        
//         // Log payment ID for debugging/tracking
//         console.log('Payment created: ' + payment.id);
        
//         // Find approval URL
//         const approvalUrl = payment.links.find(link => link.rel === 'approval_url');
        
//         if (approvalUrl) {
//           console.log('Redirecting to PayPal:', approvalUrl.href);
//           return res.redirect(approvalUrl.href);
//         } else {
//           console.error('No approval URL found');
//           return res.status(500).render('error', {
//             message: 'Payment configuration error',
//             error: {}
//           });
//         }
//       });
//     } catch (error) {
//       console.error('Unexpected error in payment processing:', error);
//       return res.status(500).render('error', {
//         message: 'An unexpected error occurred',
//         error: process.env.NODE_ENV === 'development' ? error : {}
//       });
//     }
//   });
  
//   // Simple success handler - just display a success message
//   route.get('/success', (req, res) => {
//     // Log the payment details from PayPal
//     console.log('Payment successful. PayPal data:', req.query);
    
//     // For a student project, just show success and clear cart
//     d.arr = []; // Clear the cart
    
//     res.render('success', {
//       title: 'Payment Successful',
//       message: 'Your payment was processed successfully!',
//       paymentId: req.query.paymentId,
//       // Don't store actual order in DB for simplified version
//     });
//   });
  
//   // Simple cancel handler
//   route.get('/cancel', (req, res) => {
//     res.render('cancel', {
//       title: 'Payment Cancelled',
//       message: 'Your payment was cancelled. You can try again later.'
//     });
//   });












// module.exports=route;
require('dotenv').config();
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { check, validationResult } = require('express-validator');
const paypal = require('./pay').paypal;
const User = require('./models/user');
const Cart = require('./models/cart');
const isauth = require('./midleware/isauth');

const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function removeTrailingSlash(str) {
  return str.replace(/\/$/, '');
}

// router.get('/login', (req, res) => {
//   res.render('auth', { message: req.flash('error'), err: req.flash('err') });
// });
router.get('/login', (req, res) => {
  res.render('auth', {
    logerror: req.flash('logerror'),
    success: req.flash('success')
  });
});
// router.post(
//   '/loogin',
//   [
//     check('email').isEmail().withMessage('The email is invalid!'),
//     check('password').isLength({ min: 5 }).withMessage('Invalid password!').isAlphanumeric(),
//   ],
//   async (req, res) => {
//     const { email, password } = req.body;
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       req.flash('err', errors.array()[0].msg);
//       return res.status(422).redirect('/login');
//     }

//     try {
//       const user = await User.findOne({ email });
//       if (!user || !(await bcrypt.compare(password, user.password))) {
//         req.flash('error', 'Invalid email or password!');
//         return res.redirect('/login');
//       }

//       req.session.loggedin = true;
//       res.redirect('/');
//     } catch (error) {
//       console.error('Login error:', error);
//       res.status(500).render('error', { message: 'Server Error' });
//     }
//   }
// );
// router.post(
//   '/loogin',
//   [
//     check('email').isEmail().withMessage('Please enter a valid email!'),
//     check('password').notEmpty().withMessage('Password is required!')
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       req.flash('logerror', errors.array()[0].msg);
//       console.log('Login validation errors:', errors.array());
//       return res.redirect('/login');
//     }

//     const { email, password } = req.body;

//     try {
//       const user = await User.findOne({ email });
//       if (!user) {
//         req.flash('logerror', 'No account found with this email!');
//         console.log(`Login failed: No user found for ${email}`);
//         return res.redirect('/login');
//       }

//       const isMatch = await bcrypt.compare(password, user.password);
//       if (!isMatch) {
//         req.flash('logerror', 'Incorrect password!');
//         console.log(`Login failed: Incorrect password for ${email}`);
//         return res.redirect('/login');
//       }

//       // Set session
//       req.session.loggedin = true;
//       req.session.user = { email: user.email };
//       req.flash('success', 'Login successful!');
//       console.log(`User logged in: ${email}`);
//       res.redirect('/home');
//     } catch (error) {
//       console.error('Login error:', error);
//       req.flash('logerror', 'An error occurred during login. Please try again.');
//       res.redirect('/login');
//     }
//   }
// );
router.post(
  '/login',
  [
    check('email').isEmail().withMessage('Please enter a valid email!'),
    check('password').notEmpty().withMessage('Password is required!')
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('logerror', errors.array()[0].msg);
      console.log('Login validation errors:', errors.array());
      return res.redirect('/login');
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email: email.toLowerCase() });
      if (!user) {
        req.flash('logerror', 'No account found with this email!');
        console.log(`Login failed: No user found for ${email}`);
        return res.redirect('/login');
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        req.flash('logerror', 'Incorrect password!');
        console.log(`Login failed: Incorrect password for ${email}`);
        return res.redirect('/login');
      }

      req.session.loggedin = true;
      req.session.user = { email: user.email };
      req.flash('success', 'Login successful!');
      console.log(`User logged in: ${email}`);
      res.redirect(`/?email=${email}`);
    } catch (error) {
      console.error('Login error:', error);
      req.flash('logerror', 'An error occurred during login. Please try again.');
      res.redirect('/login');
    }
  }
);
router.get('/reset', (req, res) => {
  res.render('reset', { message: req.flash('error') });
});

router.get('/resetpass/:token', async (req, res) => {
  const { token } = req.params;
  try {
    const user = await User.findOne({
      reset_token: token,
      reset_token_expires: { $gt: new Date() },
    });
    if (!user) {
      req.flash('error', 'Invalid or expired token');
      return res.redirect('/');
    }
    res.render('karoab', { token, email: user.email });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).render('error', { message: 'Server Error' });
  }
});

router.post('/password', async (req, res) => {
  const { email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 12);
    await User.updateOne({ email: removeTrailingSlash(email) }, { password: hashedPassword });
    res.redirect('/');
  } catch (error) {
    console.error('Password update error:', error);
    res.status(500).render('error', { message: 'Server Error' });
  }
});

router.post('/reset-auth', async (req, res) => {
  const { email } = req.body;
  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date(Date.now() + 3600000);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      req.flash('error', 'The user does not exist');
      return res.redirect('/reset');
    }

    await User.updateOne({ email }, { reset_token: token, reset_token_expires: expires });

    await transport.sendMail({
      to: email,
      from: process.env.EMAIL_USER,
      subject: 'Reset Password',
      html: `<p>You requested a password reset</p>
             <p>Please click on the link <a href="${process.env.HOST_URL || 'http://localhost:8080'}/resetpass/${token}">Change Password</a> to change the password</p>`,
    });

    res.redirect('/');
  } catch (error) {
    console.error('Reset auth error:', error);
    res.status(500).render('error', { message: 'Server Error' });
  }
});

router.post('/splice', (req, res) => {
  const { id } = req.body;
  const index = Cart.arr.findIndex((item) => item.id === id);
  if (index !== -1) {
    if (Cart.arr[index].quan > 1) {
      Cart.arr[index].quan--;
    } else {
      Cart.arr.splice(index, 1);
    }
  }
  res.redirect('/cartarray');
});

// router.post('/pay', async (req, res) => {
//   try {
//     const total = parseInt(req.body.amount);
//     if (isNaN(total) || total <= 0) {
//       return res.status(400).render('error', { message: 'Invalid total amount' });
//     }

//     const create_payment_json = {
//       intent: 'sale',
//       payer: { payment_method: 'paypal' },
//       redirect_urls: {
//         return_url: `${process.env.HOST_URL || 'http://localhost:8080'}/success`,
//         cancel_url: `${process.env.HOST_URL || 'http://localhost:8080'}/cancel`,
//       },
//       transactions: [
//         {
//           item_list: {
//             items: [
//               {
//                 name: 'Book Purchase',
//                 sku: 'BOOK-001',
//                 price: total.toFixed(2),
//                 currency: 'USD',
//                 quantity: 1,
//               },
//             ],
//           },
//           amount: {
//             currency: 'USD',
//             total: total.toFixed(2),
//           },
//           description: 'Book Shop Purchase',
//         },
//       ],
//     };

//     paypal.payment.create(create_payment_json, (error, payment) => {
//       if (error) {
//         console.error('PayPal Error:', error);
//         return res.status(500).render('error', { message: 'Payment service unavailable' });
//       }
//       const approvalUrl = payment.links.find((link) => link.rel === 'approval_url');
//       if (approvalUrl) {
//         res.redirect(approvalUrl.href);
//       } else {
//         res.status(500).render('error', { message: 'Payment configuration error' });
//       }
//     });
//   } catch (error) {
//     console.error('Payment processing error:', error);
//     res.status(500).render('error', { message: 'An unexpected error occurred' });
//   }
// });
router.post('/pay', async (req, res) => {
  try {
    const total = parseFloat(req.body.amount); // 🔁 FIXED

    if (isNaN(total) || total <= 0) {
      return res.status(400).render('error', { message: 'Invalid total amount' });
    }

    const create_payment_json = {
      intent: 'sale',
      payer: { payment_method: 'paypal' },
      // redirect_urls: {
      //   return_url: `${process.env.HOST_URL || 'http://localhost:8080'}/success`,
      //   cancel_url: `${process.env.HOST_URL || 'http://localhost:8080'}/cancel`,
      // },
      redirect_urls: {
  return_url: 'http://localhost:8080/success',
  cancel_url: 'http://localhost:8080/cancel',
},

      transactions: [
        {
          item_list: {
            items: [
              {
                name: 'Book Purchase',
                sku: 'BOOK-001',
                price: total.toFixed(2), // 👌 PayPal expects string with 2 decimals
                currency: 'USD',
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: 'USD',
            total: total.toFixed(2), // 👌 Also string with 2 decimals
          },
          description: 'Book Shop Purchase',
        },
      ],
    };

    paypal.payment.create(create_payment_json, (error, payment) => {
      if (error) {
        console.error('PayPal Error:', error.response || error);
        return res.status(500).render('error', { message: 'Payment service unavailable' });
      }

      const approvalUrl = payment.links.find((link) => link.rel === 'approval_url');
      if (approvalUrl) {
        res.redirect(approvalUrl.href);
      } else {
        res.status(500).render('error', { message: 'Payment configuration error' });
      }
    });
  } catch (error) {
    console.error('Payment processing error:', error);
    res.status(500).render('error', { message: 'An unexpected error occurred' });
  }
});


router.get('/success', (req, res) => {
  Cart.arr = []; // Clear cart
  res.render('success', {
    title: 'Payment Successful',
    message: 'Your payment was processed successfully!',
    paymentId: req.query.paymentId,
  });
});

router.get('/cancel', (req, res) => {
  res.render('cancel', {
    title: 'Payment Cancelled',
    message: 'Your payment was cancelled. You can try again later.',
  });
});

module.exports = router;