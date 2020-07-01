// Include environment variables
require("dotenv").config();

// Packages
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const morgan = require("morgan");

// Components
const usersRouter = require("./routers/users-router");
const quizzesRouter = require("./routers/quizzes-router");
const authRouter = require("./auth/auth-router");

// Configuration
const { CLIENT_ORIGIN, NODE_ENV } = require("./config");

const app = express();

const morganOption = NODE_ENV === "production" ? "tiny" : "common";

app.use(morgan(morganOption));
app.use(helmet());
app.use(
    cors({
        origin: CLIENT_ORIGIN,
        exposedHeaders: ["Location"],
    })
);

app.get("/", (req, res) => {
    res.send(
        "Welcome to the Quiz Builder API! Go to https://quiz-builder-client.vercel.app to start using it."
    );
});

app.use("/api/auth", authRouter);
app.use("/api/quizzes", quizzesRouter);
app.use("/api/users", usersRouter);

app.use((req, res, next) => {
    return res.status(404).json({
        error: { message: `Address ${req.url} can't be found.` },
    });
});
app.use((error, req, res, next) => {
    let response;
    if (process.env.NODE_ENV === "production") {
        response = { error: { message: "Internal server error" } };
    } else {
        console.error(error);
        response = {
            error: { message: "Internal server error", error },
        };
    }
    res.status(500).json(response);
});

module.exports = app;
