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
const cors = require("cors");
const cookieParser = require("cookie-parser");
const compression = require("compression");

const { errorHandling } = require("expresso-utils");
const viewRouter = require("./routes/view-routes");
const authRouter = require("./routes/auth-routes");

const app = express();

app.enable("trust proxy");

console.log("NODE_ENV: " + process.env.NODE_ENV);
console.log("APP_ENV: " + process.env.APP_ENV);


/* GLOBAL MIDDLEWARES */

// setting view engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views"));

// Serving static files
// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname, "public")));

// Setting security HTTP headers
app.use(
    helmet({
        contentSecurityPolicy: false // VERY BAD: disabling content security policy
}));

app.use(bodyParser.json({ limit: "100kb" })); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true, limit: "100kb"})); // for parsing application/x-www-form-urlencoded

app.use(cookieParser());

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
// app.use((req, res, next) => {
//     res.setHeader("Access-Control-Allow-Origin", "*");
//     res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     res.setHeader("Access-Control-Allow-Headers", "Content-Type");
//     // console.log(req.headers);

//     next();
// });

app.use(cors());
app.options('*', cors());


// Allow loading external images 
// https://stackoverflow.com/questions/21048252/nodejs-where-exactly-can-i-put-the-content-security-policy
app.use((req, res, next) => {
    //res.setHeader("Content-Security-Policy", "img-src 'self' https://cdnjs.cloudflare.com");
    //res.setHeader("Content-Security-Policy", "worker-src 'self' https://api.mapbox.com");
    //res.setHeader("Content-Security-Policy", "img-src 'self' https://api.mapbox.com");
    //res.set("Content-Security-Policy", "default-src 'self'");

    next();
});

// enable response compression
app.use(compression());

// Test Middleware
app.use((req, res, next) => {
    req.requestTime = new Date().toISOString();
    // console.log("cookies:", req.cookies);
    
    next();
}); 


// ROUTES
app.use("/", viewRouter);
app.use("/api/v1/auth", authRouter);

/* FALLBACK ROUTE */
app.all("*", (req, res, next) => {
    const err = new errorHandling.AppError(`Can't find ${req.originalUrl} on this server!`, 404);
    next(err);
});

/* GLOBAL ERROR HANDLING MIDDLEWARE */
app.use(errorHandling.globalErrorHandler);


module.exports = app;