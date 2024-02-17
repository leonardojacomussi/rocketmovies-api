require("express-async-errors");
const AppError = require("./utils/AppError");
const express = require("express");
const routes = require("./routes");
const sqlConnection = require("./database/sqlite");

sqlConnection()
  .then(() => console.log("Connected to SQLite"))
  .catch(console.error);

const app = express();

app.use(express.json());

app.use(routes);

app.use((error, req, res, next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      status: "error",
      message: error.message,
    });
  };

  console.error(error);

  return res.status(500).json({
    status: "error",
    message: "Internal server error",
  });
});

const PORT = 3333;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));