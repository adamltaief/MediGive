const express = require("express");
const connectToDb = require("./config/connectToDb");
const { errorHandler, notFound } = require("./middlewares/error");
require("dotenv").config();

// connecttion to Db
connectToDb();

//Init App
const app = express();

// Middlewares
app.use(express.json());

//Routes
app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/usersRoute"));
app.use("/api/dons", require("./routes/donsRoute"));
app.use("/api/donsmedicaments", require("./routes/donsMedicamRoute"));
app.use("/api/donsappareil", require("./routes/donsAppareilRoute"));
app.use("/api/donsvirement", require("./routes/donsVirementRoute"));

// Error Handler Middleware
app.use(notFound);
app.use(errorHandler);

//Running The Server
const PORT = process.env.PORT || 8000;
app.listen(PORT,() => console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`));