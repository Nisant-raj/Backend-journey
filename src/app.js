const express = require('express');
const userRoute = require('./routes/user.routes');
const logger = require('./middlewares/logger.middleware');
const errorHandler = require('./middlewares/error.middleware');
const connectDB =require("./config/db.config")

connectDB();
const app =express()
app.use(express.json());
app.use(logger);

app.use('/api/user',userRoute)

app.use(errorHandler);
module.exports =app