module.exports = {
    env: process.env.NODE_ENV,
    appEnv: process.env.APP_ENV,
    port: process.env.PORT || 5000,
    dbConnection: process.env.DATABASE_CONNECTION,
    // apiUrl: process.env.API_URL,
    email: {
        address: process.env.EMAIL_ADDRESS,
        host: process.env.EMAIL_HOST,
        userName: process.env.EMAIL_USERNAME,
        password: process.env.EMAIL_PASSWORD
    }
};