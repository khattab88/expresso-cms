/* eslint-disable prettier/prettier */
const path = require('path');
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xssClean = require("xss-clean");
const hpp = require("hpp");

const AppError = require("./utils/app-error");
const globalErorrHandler = require("./controllers/error-controller");
const viewRouter = require("./routes/view-routes");


const app = express();

console.log(process.env.NODE_ENV);
console.log(process.env.APP_ENV);
console.log(process.env.ECHO);


/* GLOBAL MIDDLEWARES */

// setting view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
app.use(express.static(`${__dirname}/public`));

// Setting security HTTP headers
app.use(helmet());

app.use(bodyParser.json({ limit: "100kb" })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS attacks
app.use(xssClean());

// prevent http parameter pollution
app.use(hpp());

// Development Logging
if(process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}

// Limiting requests from same IP address
const limiter = rateLimit({
    max: 100,
    windowMs: 60 * 60 * 1000,
    message: "Too many requests from this IP, please try again in a hour!"
});
app.use("/api/", limiter);

// Enabling CORS
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    // console.log(req.headers);

    next();
});

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    next();
}); 


// ROUTES
app.use("/", viewRouter);


/* FALLBACK ROUTE */
app.all("*", (req, res, next) => {
    const err = new AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
});

/* GLOBAL ERROR HANDLING MIDDLEWARE */
app.use(globalErorrHandler);


module.exports = app;