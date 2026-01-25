const express = require('express');
const dotenv = require('dotenv');
const session = require('express-session');
const path = require('path');

dotenv.config();

const app = express();

// body parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ✅ STATIC FILES (CỰC KỲ QUAN TRỌNG)
app.use(express.static(path.join(__dirname, 'public')));

// session
app.use(session({
  secret: process.env.SESSION_SECRET || 'secret123',
  resave: false,
  saveUninitialized: false
}));

// view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
app.use('/', require('./routes'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
