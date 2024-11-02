const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

const data = require("./mockData.json");

app.get("/users", function (req, res) {
  const url = req.url;
  if (url.startsWith("/users?")) {
    const splitUrl = url.split("?");
    const id = splitUrl[1];
    const user = data.find((user) => {
      return user.id == id;
    });
    if (user) {
      res.send(user);
    } else {
      res.send({ message: "User Not Found" });
    }
  }
  res.send(data);
});
app.post("/login", (req, res) => {
  const body = req.body;
  const user = data.find((user) => {
    return user.name === body.name && user.password == Number(body.password);
  });

  if (user) {
    res.send(user);
  } else {
    res.send("User Not Found");
  }
});
app.post("/signup", (req, res) => {
  const body = req.body;
  const user = data.find((user) => {
    return user.name === body.name;
  });
  if (user) {
    res.send("UserName Already Taken");
  } else {
    const newBody = {
      id: JSON.stringify(data.length + 1),
      ...body,
    };
    data.push(newBody);
    fs.writeFileSync("./mockData.json", JSON.stringify(data), (err) => {
      console.log(err);
    });
  }
});

app.listen(3000);
