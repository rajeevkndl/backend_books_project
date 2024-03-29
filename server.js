const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors({ orgin: "*" }));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use("/", require("./app/routes"));

app.listen(8000, () => {
  console.log("server is running");
});
