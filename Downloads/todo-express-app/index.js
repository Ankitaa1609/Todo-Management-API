const dotenv = require("dotenv");
const mongoose = require("mongoose");
const app = require("./app");

process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Exception!");
  process.exit(1);
});

dotenv.config({ path: "./.env" });

const port = process.env.PORT;

const dbUrl = process.env.DB_URI;

if (!dbUrl) {
  console.log("Database URL is not defined in the environment variables.");
  process.exit(1);
}

mongoose.connect(dbUrl).then(() => {
  console.log("Database is running");
});

const server = app.listen(port, () => {
  console.log("Server is running on the port ", port);
});

process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  console.log("Unhandled Rejection!");
  server.close(() => {
    process.exit(1);
  });
});
