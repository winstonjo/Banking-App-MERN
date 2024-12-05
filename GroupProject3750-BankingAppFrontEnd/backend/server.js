const express = require('express');
const app = express();
const cors = require('cors');
const session = require('express-session');
require('dotenv').config({ path: './config.env' });

const MongoStore = require('connect-mongo');
const dbo = require('./db/conn');

const port = process.env.PORT;

app.use(
  cors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
  })
);

app.use(
  session({
    secret: 'keyboard cat',
    saveUninitialized: false, // Don't create sessions until something is stored
    resave: false, // Don't save session if unmodified
    store: MongoStore.create({
      mongoUrl: process.env.ALTAS_URI
    }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    }
  })
);

app.use(express.json());

// Routes
app.use(require('./routes/bankingRoutes'));

app.listen(port, () => {
  dbo.connectToServer(function (err) {
    if (err) {
      console.error(err);
    }
  });
  console.log(`Server is running on port ${port}`);
});
