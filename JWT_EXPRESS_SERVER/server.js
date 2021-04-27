require('dotenv').config({path:"./config.env"});

const express = require('express');
const app = express();
const authRoute = require('./Routes/auth');
const appRoute = require('./Routes/private-route');
const establishDBConnection = require('./DBConfig/DBConnection');
const ErrorHandler = require('./Middlewares/ErrorHandler');
const CORS = require('cors');


//establish DB connection
establishDBConnection();
app.use(express.json());
app.use(CORS());
//auth
app.use('/',authRoute);
//app - private route
app.use('/api/private',appRoute);
app.use(ErrorHandler);

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => console.log(`Server is up and running on PORT : ${process.env.PORT || 5000}`));

process.on("unhandledRejection" , (err,promise) => {
    console.log(` Application Error occured : ${err.message}`);
    server.close(() => {
        console.log('Server Stopped');
        process.exit(1);
    })
})