const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');

const requireAuth = require( './middleware/requireAuth');

const userRoute = require( './routes/user');
const postRoute = require( './routes/post');


require('dotenv').config();

const app = express();

//middleware
app.use((request, res, next) => {
  console.log(request.path, request.method);
  next();
})
app.use(express.json())
app.use(cors({
  origin: 'http://localhost:5173'
}));


const sessionConfig = {
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // set to true in production
    maxAge: 3 * 24 * 60 * 60 * 1000 // 3 days
  }
};

app.use(session(sessionConfig));

const authMiddleware = (request, response, next) => {
  if (request.path === '/login' || request.path === '/signup') {
    return next();
  }
  requireAuth(request, response, next);
};

app.use(authMiddleware);

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
  app.listen(process.env.PORT, () => {
  console.log(`Connected to DB and listening on port ${process.env.PORT}`)
  })
  })
  .catch((error) => {
    console.error('Error connecting to DB:', error);
  })


//routes
app.use('/', userRoute);
app.use('/post', postRoute);