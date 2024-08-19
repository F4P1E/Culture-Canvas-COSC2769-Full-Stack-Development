import express from 'express';
import mongoose from 'mongoose';
const cors = require('cors');
const session = require('express-session');

import userRoute from './routes/user';

require('dotenv').config();

const app: express.Application = express();

//middleware
app.use((req, res, next) => {
  console.log(req.path, req.method);
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

mongoose.connect(process.env.MONGO_URI!
)
  .then(() => {
  app.listen(process.env.PORT, () => {
  console.log(`Connected to DB and listening on port ${process.env.PORT}`)
  })
  })
  .catch((error) => {
    console.error('Error connecting to DB:', error);
  })


//routes
app.use('/user', userRoute);
