const express = require("express");
const app = express();
const path = require("path");

app.use(express.json());
require("./encryption")(app);

app.get("/", async (req, res) => {
  res.sendFile(path.join(__dirname, "./describe.json"));
});

app.get("/health", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "text/plain");
  res.send("OK");
});

app.listen(8080, () => console.log("Running on 8080"));
