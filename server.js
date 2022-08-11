const express = require("express");
const http = require("http");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const morgan = require('morgan')


const socketServer = require('./socketServer');

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes//userRoutes");
const friendRequestRoutes = require("./routes/friendRequestRoutes")

const PORT = process.env.PORT || process.env.API_PORT;

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('dev'))

// register the routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes)
app.use("/api/friend-invitation", friendRequestRoutes)

const server = http.createServer(app);
socketServer.registerSocketServer(server)


mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is listening on ${PORT} and connected to DB`);
    });
  })
  .catch((err) => {
    console.log("database connection failed. Server not started");
    console.error(err);
  });
