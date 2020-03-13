const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");
require("dotenv").config();

const actionRouter = require("./routes/actionRouter.js");
const projectRouter = require("./routes/projectRouter.js");

const server = express();
const globalMiddleWare = [express.json(), helmet(), logger];

server.use(globalMiddleWare);

server.use("/api/projects", projectRouter);
server.use("/api/actions", actionRouter);

server.get("/", (req, res) => {
  const newThing = { thing: "Cool", yep: "yes" };
  res.status(200).json(newThing);
});

module.exports = server;

function logger(req, res, next) {
  console.log(`${req.method} requests to ${req.originalUrl}`);
  next();
}
