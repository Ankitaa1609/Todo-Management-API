const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRouter = require("./routers/auth.router");
const userRouter = require("./routers/user.router");
const adminRouter = require("./routers/admin.router");
const taskRouter = require("./routers/task.router");

const AppError = require("./utils/AppError");
const globalErrorHandler = require("./controllers/error.controller");

const app = express();

app.use(cors());
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res, next) => {
  return res.status(200).json({
    status: "ok",
  });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/tasks", taskRouter);

app.use((req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
