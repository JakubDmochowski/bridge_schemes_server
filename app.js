var express = require("express");
var app = express();
const fs = require("fs");
const cors = require("cors");
app.use(cors());
app.use(express.json());

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
    return;
  }
  if (!req.params.id) {
    res.end("error: provide id of node to query");
    return;
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
    return;
  }
});

app.patch("/:scheme/:id", async function (req, res) {
  if (
    !(
      req.params.scheme &&
      typeof req.params.scheme === "string" &&
      schemes.includes(req.params.scheme)
    )
  ) {
    res.end("error: provide scheme");
    return;
  }
  if (!req.params.id) {
    res.end("error: provide id of node to query");
    return;
  }
  const file = __dirname + "\\schemes\\" + req.params.scheme + ".json";
  try {
    await fs.readFile(file, async function (err, data) {
      let filedata = JSON.parse(data);
      const entryIndex = filedata.findIndex((e) => e.id === req.params.id);
      let previousData = filedata[entryIndex];
      filedata = [
        ...filedata.slice(0, entryIndex),
        req.body,
        ...filedata.slice(entryIndex + 1),
      ];
      await fs.writeFileSync(file, JSON.stringify(filedata), {
        encoding: "utf8",
        flag: "w",
      });
      console.log(
        `updated: ${JSON.stringify(previousData)} to ${JSON.stringify(
          req.body
        )}`
      );
    });
    res.end(`successfully updated node ${req.params.id}`);
  } catch (e) {
    console.log(e);
    res.end("error: scheme not found");
    return;
  }
});

app.put("/:scheme/:id", async function (req, res) {
  if (
    !(
      req.params.scheme &&
      typeof req.params.scheme === "string" &&
      schemes.includes(req.params.scheme)
    )
  ) {
    res.end("error: provide scheme");
    return;
  }
  if (!req.params.id) {
    res.end("error: provide id of node to query");
    return;
  }
  const file = __dirname + "\\schemes\\" + req.params.scheme + ".json";
  try {
    await fs.readFile(file, async function (err, data) {
      let filedata = JSON.parse(data);
      filedata = [...filedata, req.body];
      await fs.writeFileSync(file, JSON.stringify(filedata), {
        encoding: "utf8",
        flag: "w",
      });
      console.log(`created: ${JSON.stringify(req.body)}`);
    });
    res.end(`successfully updated node ${req.params.id}`);
  } catch (e) {
    console.log(e);
    res.end("error: scheme not found");
    return;
  }
});

const removeUnaccessibleNodes = (data) => {
  const accessibleIds = [];
  let nodesToSearch = [data[0]];
  while (nodesToSearch.length) {
    const checked = nodesToSearch.shift();
    accessibleIds.push(checked.id);
    nodesToSearch = nodesToSearch.concat(
      data
        .filter((el) =>
          (checked.next_steps || []).map((step) => step.id).includes(el.id)
        )
        .filter((el) => !accessibleIds.includes(el.id))
    );
  }
  return data.filter((el) => accessibleIds.includes(el.id));
};

app.delete("/:scheme/:id", async function (req, res) {
  if (
    !(
      req.params.scheme &&
      typeof req.params.scheme === "string" &&
      schemes.includes(req.params.scheme)
    )
  ) {
    res.end("error: provide scheme");
    return;
  }
  if (!req.params.id) {
    res.end("error: provide id of node to query");
    return;
  }
  const file = __dirname + "\\schemes\\" + req.params.scheme + ".json";
  try {
    await fs.readFile(file, async function (err, data) {
      let filedata = JSON.parse(data);
      const entryIndex = filedata.findIndex((e) => e.id === req.params.id);
      let previousData = filedata[entryIndex];
      filedata = filedata.map((el) => ({
        ...el,
        next_steps: (el.next_steps || []).filter((e) => e.id !== req.params.id),
      }));
      filedata = [
        ...filedata.slice(0, entryIndex),
        ...filedata.slice(entryIndex + 1),
      ];
      filedata = removeUnaccessibleNodes(filedata);
      await fs.writeFileSync(file, JSON.stringify(filedata), {
        encoding: "utf8",
        flag: "w",
      });
      console.log(`deleted: ${JSON.stringify(previousData)}`);
    });
    res.end(`successfully updated node ${req.params.id}`);
  } catch (e) {
    console.log(e);
    res.end("error: scheme not found");
    return;
  }
});
var server = app.listen(port, hostname, () => {
  console.log(`Bridge server running at http://${hostname}:${port}/`);
});
