
require('dotenv').config();
const express = require('express');
const crypto = require('crypto');
const fs = require('fs');
const userp=require('./models/products');
const PDFDocument = require('pdfkit');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const path = require('path');
const nodemailer = require('nodemailer');
const flash = require('connect-flash');
const { check, validationResult } = require('express-validator');
const multer = require('multer');
const paypal = require('paypal-rest-sdk');
const Product = require('./models/product');
const Cart = require('./models/cart');
const Order = require('./models/order');
const connectDB = require('./util/database');
const isauth = require('./midleware/isauth');
const loginRoutes = require('./login');
const User = require('./models/user');


const app = express();

// Connect to MongoDB
connectDB();

// Setup EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Create images directory if it doesn't exist
const imageDir = path.join(__dirname, 'images');
if (!fs.existsSync(imageDir)) {
  fs.mkdirSync(imageDir);
}

// File storage configuration for multer
const filestore = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
    cb(null, `${new Date().toISOString().replace(/:/g, '-')}-${file.originalname}`);
  }
});

const upload = multer({
  storage: filestore,
  fileFilter: (req, file, cb) => {
    // Optional: Restrict to images
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'));
    }
  }
});

// Middleware setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Properly serve static files - make sure these come BEFORE your routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use(express.static(path.join(__dirname, 'public')));

// Session store with MongoDB
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: 'sessions',
});
store.on('error', (error) => {
  console.error('Session store error:', error);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
      maxAge: 60*60*1000,
      secure: process.env.NODE_ENV === 'production', // Secure cookies in production
    },
  })
);

app.use(flash());
app.use(loginRoutes);

// Trust proxy for deployment behind load balancers
app.set('trust proxy', 1);

// Nodemailer setup
const transport = nodemailer.createTransport({
  service: 'gmail',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Flash messages middleware
app.use((req, res, next) => {
  res.locals.done = req.flash('done');
  res.locals.signerror = req.flash('signerror');
  res.locals.logerror = req.flash('logerror');
  res.locals.success = req.flash('success');
  next();
});

// Routes
app.get('/', (req, res) => {
  if(req.session.loggedin){
    res.render('h', { session: req.session.loggedin, photo: process.env.PHOTO,email:req.query.email||'example@gmail.com' });
  }else{
  res.render('h', { session: req.session.loggedin, photo: process.env.PHOTO });
  }
});

// Corrected home route
app.get('/home', async (req, res) => {
  const ITEMS = 4;
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const skip = (page - 1) * ITEMS;

  try {
    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / ITEMS);
    const products = await Product.find()
      .skip(skip)
      .limit(ITEMS)
      .select('id title imageURL price')
      .lean();
    
    // Map products to include the correct image path for the template
    const mappedProducts = products.map(product => ({
      ...product,
      image: product.imageURL // Map imageURL to image for the template
    }));
    
    // Debug log to verify image paths
    console.log('Products with images:', JSON.stringify(mappedProducts.map(p => ({
      title: p.title,
      image: p.image
    })), null, 2));
    
    res.render('home', {
      products: mappedProducts,
      session: !!req.session.loggedin,
      totalPages,
      currentPage: page,
      csrfToken: typeof req.csrfToken === 'function' ? req.csrfToken() : '' // Fallback for CSRF
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).render('error', {
      message: process.env.NODE_ENV === 'development' ? error.message : 'Internal Server Error'
    });
  }
});


app.post('/profile', (req, res) => {
  const email = req.query.email; // or from session
  const ans = Cart.arr.map(a => ({
    id: a.id,
    title: a.title,
    image: a.image,
    price: a.price,
    quan: a.quan
  }));
  res.render('profile', {
    email: email,
    arr: userp.arr,
    cart: ans,
    photo: process.env.PHOTO
  });
});













app.get('/addproduct', isauth, (req, res) => {
  res.render('add', { mess: req.flash('mess') });
});

// Corrected product creation route
app.post(
  '/adding',
  upload.single('image'),
  [
    check('id').isNumeric().withMessage('Add valid id!'),
    check('title').isLength({ min: 3 }).withMessage('Enter valid title!'),
    check('price').isNumeric().withMessage('Enter valid prices!'),
  ],
  async (req, res) => {
    const { id, title, price } = req.body;
    const image = req.file;

    if (!image) {
      req.flash('mess', 'No file uploaded');
      return res.status(422).redirect('/addproduct');
    }

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('mess', errors.array()[0].msg);
      return res.status(422).redirect('/addproduct');
    }

    try {
      // Normalize path to forward slashes
      const imagePath = image.path.replace(/\\/g, '/');
      
      const product = new Product({
        id: id.toString(),
        title,
        imageURL: imagePath,
        price: parseFloat(price),
      });
      await product.save();
      userp.arr.push({
  id: id.toString(),
  title: title,
  image: imagePath,
  price: parseFloat(price)
});
      console.log('Product added:', title);
      console.log('Image path:', imagePath);
      res.redirect('/');
    } catch (error) {
      console.error('Error adding product:', error);
      res.status(500).render('error', { message: 'Internal Server Error' });
    }
  }
);

app.post('/detail', (req, res) => {
  const { image, id, title } = req.body;
  res.render('datail', { image, id, mess: req.flash('mess'), title,session: !!req.session.loggedin });
});

app.get('/detail', (req, res) => {
  const { image, id, title } = req.query; // Use query for GET
  res.render('datail', { image, id, mess: req.flash('mess'), title });
});

app.post('/cart', isauth, (req, res) => {
  const { id, title, image, quan, price } = req.body;
  Cart.arr.push({ id, title, image, quan: parseInt(quan), price: parseFloat(price) });
  // res.redirect('/cartarray');
});

app.get('/cartarray', (req, res) => {
  res.render('cart', { d: Cart });
});

app.post('/order', async (req, res) => {
  const orderId = crypto.randomBytes(20).toString('hex');
  const total = parseFloat(req.body.total);
  const ans = Cart.arr.map((a) => ({
    id: a.id,
    title: a.title,
    image: a.image,
    quan: a.quan,
    price: a.price,
  }));

  try {
    const order = new Order({ orderId, items: ans, total });
    await order.save();
    res.render('order', { ans, id: orderId, total });
  } catch (error) {
    console.error('Error creating order:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

app.get('/order/:orderid/:total', async (req, res) => {
  const { orderid, total } = req.params;
  const invoiceName = `invoice-${orderid}.pdf`;

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${invoiceName}"`);

  const doc = new PDFDocument();
  doc.pipe(res);

  try {
    const order = await Order.findOne({ orderId: orderid }).lean();
    if (!order) {
      doc.text('Order not found');
      return doc.end();
    }

    doc.fontSize(10).text(new Date().toISOString());
    doc.fontSize(26).text('Invoice', { underline: true });
    doc.text('-----------------------------------------');
    doc.text('Your Order:');
    order.items.forEach((item) => {
      doc.text(`${item.title} -> ${item.quan}`);
    });
    doc.text(`Total amount = ₹${total}`);
    doc.text('Thank you for buying from Bookshop!');
    doc.end();
  } catch (error) {
    console.error('Error generating invoice:', error);
    doc.text('Error generating invoice');
    doc.end();
  }
});

app.post('/delete', async (req, res) => {
  const { id } = req.body;
  try {
    await Product.deleteOne({ id });
    req.flash('mess', 'The product has been deleted!');
    res.redirect('/home');
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).render('error', { message: 'Internal Server Error' });
  }
});

app.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Session destruction error:', err);
      return res.status(500).render('error', { message: 'Failed to logout' });
    }
    res.redirect('/');
  });
});

app.get('/signin', (req, res) => {
  res.render('signin', {
    done: req.flash('done'),
    signine: req.flash('signerror') // Note: This should be signerror
  });
});

app.post(
  '/valid',
  [
    check('email')
      .isEmail()
      .withMessage('Please enter a valid email!')
      .custom(async (value) => {
        try {
          const user = await User.findOne({ email: value.toLowerCase() });
          if (user) {
            throw new Error('This email is already registered!');
          }
          return true;
        } catch (error) {
          // Log unexpected errors but rethrow validation errors
          if (error.message === 'This email is already registered!') {
            throw error;
          }
          console.error('Error in email validation:', error);
          throw new Error('An error occurred while checking the email.');
        }
      }),
    check('password')
      .isLength({ min: 5 })
      .withMessage('Password must be at least 5 characters long')
      .matches(/[a-zA-Z0-9]/)
      .withMessage('Password must contain alphanumeric characters'),
    check('cpassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match!');
      }
      return true;
    })
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      req.flash('signerror', errors.array()[0].msg);
      console.log('Validation errors:', errors.array());
      return res.redirect('/signin');
    }
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const user = new User({ email: email.toLowerCase(), password: hashedPassword });
      await user.save();
      req.flash('done', 'Account created! Please check your email.');
      console.log(`User created: ${email}`);
      await transport.sendMail({
        to: email,
        from: process.env.EMAIL_USER,
        subject: 'Welcome to Book Shop!',
        html: '<h1>You have successfully signed up! Welcome to Book Shop</h1>'
      });
      res.redirect('/signin');
    } catch (error) {
      console.error('Sign-up error:', error);
      req.flash('signerror', 'An error occurred during sign-up. Please try again.');
      res.redirect('/signin');
    }
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unexpected error:', err);
  res.status(500).render('error', {
    message: 'An unexpected error occurred',
    error: process.env.NODE_ENV === 'production' ? {} : err,
  });
});











// 404 handler
app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, '404.html'));
});









// Start server
const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});