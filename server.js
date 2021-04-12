import express from "express";
import ResponseError from "./responseError.js";
import fs from "fs";

const app = express();
const PORT = 5000;

const golfers = [
  {
    id: "1",
    firstName: "Phil",
    lastName: "Mickelson",
    age: "50",
    mainSponsor: "Callaway",
  },
  {
    id: "2",
    firstName: "Justin",
    lastName: "Thomas",
    age: "28",
    mainSponsor: "Titleis",
  },
  {
    id: "3",
    firstName: "Dustin",
    lastName: "Johnson",
    age: "36",
    mainSponsor: "TaylorMade",
  },
];

const error = {
  ERROR: "Nothing was found",
};

// LOGGER MIDDLEWARE
app.use((res, req, next) => {
  console.log(req.method + " " + req.path);
  next();
});

app.use(express.static("./public"));
app.use(express.json());

// GET ALL
app.get("/api", (req, res) => {
  fs.readFile("./golfers.json", (err, data) => {
    if (err) {
      console.error(err);
      res.status[500].json("Something went wrong... ");
    }
    res.json(JSON.parse(data.toString()));
  });
});

// GET SPECIFIC
app.get("/api/:id", (req, res) => {
  const id = req.params.id;
  const golfer = golfers.find((g) => g.id === id);
  golfer ? res.json(golfer) : res.json(error);
});

// ADD NEW
app.post("/api", (req, res) => {
  const { firstName, lastName, age, mainSponsor } = req.body;
  const newGolfer = {
    id: String(getNewId(golfers)),
    firstName: firstName,
    lastName: lastName,
    age: age,
    mainSponsor: mainSponsor,
  };
  golfers.push(newGolfer);

  res.json(
    `New golfer ${newGolfer.firstName + " " + newGolfer.lastName} is saved.`
  );
});

// DELETE
app.delete("/api/:id", (req, res) => {
  const id = req.params.id;
  const i = golfers.findIndex((g) => g.id === id);
  if (i === -1) {
    return new ResponseError(404, `Index ${req.params.id} is not defined.`);
  } else {
    golfers.splice(i, 1);
    res.json(golfers);
  }
});

// ERROR MIDDLEWARE
app.use((err, req, res, next) => {
  console.log(err);
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ message: err.message });
});

// LISTEN
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});

const getNewId = (list) => {
  let newId = 0;
  list.forEach((o) => {
    if (Number(o.id) >= newId) {
      newId = o.id;
    }
  });
  newId++;
  return newId;
};
