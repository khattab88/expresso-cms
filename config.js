module.exports = {
    env: process.env.NODE_ENV,
    appEnv: process.env.APP_ENV,
    port: process.env.PORT || 5000,
    dbConnection: process.env.DATABASE_CONNECTION
};