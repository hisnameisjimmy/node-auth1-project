const express = require("express");

const UsersRouter = require("./users/users-router.js");
const AuthRouter = require("./auth/auth-router.js");

const session = require("express-session");
const knexSessionStore = require("connect-session-knex")(session);
const server = express();
const helmet = require("helmet");
const cors = require("cors");

const sessionOptions = {
  name: "mycookie",
  secret: "cookiesareyumyummewantcookies",
  cookie: {
    maxAge: 1000 * 60 * 60,
    secure: false,
    httpOnly: true
  },
  resave: false,
  saveUninitialized: false,

  store: new knexSessionStore({
    knex: require("./data/dbConfig.js"),
    tablename: "sessions",
    sidfieldname: "sid",
    createtable: true,
    clearInterval: 1000 * 60 * 60
  })
};

server.use(helmet());
server.use(express.json());
server.use(cors());

server.use(session(sessionOptions));
server.use(express.json());
server.use("/api/users", UsersRouter);
server.use("/api/auth", AuthRouter);

module.exports = server;
