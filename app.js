var express = require("express");
var app = express();
const fs = require("fs");
const cors = require("cors");
app.use(cors());

const hostname = "127.0.0.1";
const port = 3000;

const schemes = ["precision"];

app.get("/:scheme/:id", function (req, res) {
  if (
    !(
      req.params.scheme &&
      typeof req.params.scheme === "string" &&
      schemes.includes(req.params.scheme)
    )
  ) {
    res.end("error: provide scheme");
  }
  if (!req.params.id) {
    res.end("error: provide id of node to query");
  }
  const file = __dirname + "\\schemes\\" + req.params.scheme + ".json";
  try {
    fs.readFile(file, function (err, data) {
      data = JSON.parse(data);
      const entry = data.find((el) => el.id === req.params.id);
      res.end(JSON.stringify(entry));
    });
  } catch (e) {
    console.log(e);
    res.end("error: scheme not found");
  }
});

var server = app.listen(port, hostname, () => {
  console.log(`Bridge server running at http://${hostname}:${port}/`);
});
