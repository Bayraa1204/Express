const express = require("express");
const app = express();
app.use(express.json());
const fs = require("fs");

const data = require("./mockData.json");

const checkNameAndPass = (req, res, next) => {
  const body = req.body;
  const user = data.find((user) => {
    return user.name === body.name && user.password == Number(body.password);
  });
  if (!user) {
    res.send("Name or Password is Incorrect");
  } else {
    next();
  }
};
const checkAccountAvailable = (req, res, next) => {
  const body = req.body;
  const user = data.find((user) => {
    return user.name === body.name;
  });
  if (user) {
    res.send("UserName Already Taken");
  } else {
    next();
  }
};

app.post("/signup", checkAccountAvailable, (req, res) => {
  const body = req.body;
  const newBody = {
    id: JSON.stringify(data.length + 1),
    ...body,
  };
  data.push(newBody);
  fs.writeFileSync("./mockData.json", JSON.stringify(data), (err) => {
    console.log(err);
  });
});

app.post("/login", checkNameAndPass, (req, res) => {
  const body = req.body;
  const user = data.find((user) => {
    return user.name === body.name && user.password == Number(body.password);
  });
  res.send(user);
});

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

app.delete("/", (req, res) => {
  const body = req.body;
  if (body.id !== Number(body.id)) {
    const filteredData = data.filter((user) => {
      return user.id !== body.id;
    });
    fs.writeFileSync("./mockData.json", JSON.stringify(filteredData), (err) => {
      console.log(err);
    });
  } else {
    console.log("no number");
  }
});

app.listen(3000);
