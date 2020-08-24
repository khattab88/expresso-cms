/* eslint-disable prettier/prettier */
/* eslint-disable prefer-destructuring */
/* eslint-disable dot-notation */
/* eslint-disable prettier/prettier */
/* eslint-disable no-console */
/* eslint-disable prettier/prettier */
const dotenv = require("dotenv");
const mongoose = require("mongoose");


/* handle UNCAUGHT EXCEPTION for sync code */
process.on("uncaughtException", err => {
    console.log("UNCAUGHT EXCEPTION!");
    console.error(err);
    
    // shutdown app immediately
    process.exit(1);
});


dotenv.config({ path: "./config.env" });
const config = require("./config");

const app = require("./app");


const connectionString = config[(config["env"])].connectionString;
mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false
})
.then(conn => { 
    // console.log(conn.connections); 
    console.log("DB Connection Successful.")
})
.catch(err => { 
    console.error(err);
    console.log("Unable to connect to DB.");

    process.exit(1);
});


const server = app.listen(process.env.PORT || 5000, () => {
    console.log("server started...")
});


/* handle UNHANDLED REJECTION for async code */
process.on('unhandledRejection', err => {
    console.log("UNHANDLED REJECTION!");
    console.error(err);
    
    // shutdown app gracefully
    server.close(() => {
        process.exit(1);
    });
});