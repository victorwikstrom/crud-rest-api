import express from "express";
import ResErr from "./resErr.js";
import { readJsonData, writeJsonData, getNewId } from "./helpers.js";
import "express-async-errors";

const app = express();
const PORT = 5000;

app.use(express.static("./public"));
app.use(express.json());

// GET ALL
app.get("/api", async (req, res) => {
  const data = await readJsonData("./golfers.json");
  if (data) {
    const golfers = JSON.parse(data.toString());
    res.json(golfers);
  } else {
    throw new ResErr(404, "No golfers defined in datafile");
  }
});

// GET SPECIFIC
app.get("/api/:id", async (req, res) => {
  const data = await readJsonData("./golfers.json");
  const golfers = JSON.parse(data.toString());
  if (data) {
    const golfer = golfers.find((g) => g.id === req.params.id);
    if (!golfer) {
      throw new ResErr(
        404,
        `No golfer with id '${req.params.id}' exists in file`
      );
    }
    res.json(golfer);
  } else {
    throw new ResErr(404, "No golfers defined in datafile");
  }
});

// ADD NEW
app.post("/api", async (req, res) => {
  const data = await readJsonData("./golfers.json");
  if (data) {
    const golfers = JSON.parse(data.toString());
    const { firstName, lastName, age, mainSponsor } = req.body;
    const newGolfer = {
      id: String(getNewId(golfers)),
      firstName: firstName,
      lastName: lastName,
      age: age,
      mainSponsor: mainSponsor,
    };
    golfers.push(newGolfer);

    await writeJsonData("./golfers.json", golfers);
    res.json(
      `New golfer ${
        newGolfer.firstName + " " + newGolfer.lastName
      } is saved to JSON-file.`
    );
  } else {
    throw new ResErr(404, "No golfers defined in datafile");
  }
});

// UPDATE GOLFER SPONSOR
app.put("/api/:id", async (req, res) => {
  const data = await readJsonData("./golfers.json");
  if (data) {
    const golfers = JSON.parse(data.toString());

    const index = golfers.findIndex((g) => g.id === req.params.id);

    if (index === -1) {
      throw new ResErr(
        404,
        `No golfer with id '${req.params.id}' exists in file`
      );
    }
    const { mainSponsor } = req.body;
    golfers[index].mainSponsor = mainSponsor;
    await writeJsonData("./golfers.json", golfers);
    res.json(
      `Golfer ${
        golfers[index].firstName + " " + golfers[index].lastName
      } has updated sponsor to ${mainSponsor}.`
    );
  } else {
    throw new ResErr(404, "No golfers defined in datafile");
  }
});

// DELETE
app.delete("/api/:id", async (req, res) => {
  const data = await readJsonData("./golfers.json");
  if (data) {
    const golfers = JSON.parse(data.toString());

    const id = req.params.id;
    const index = golfers.findIndex((g) => g.id === id);

    if (index === -1) {
      throw new ResErr(
        404,
        `No golfer with id '${req.params.id}' exists in file`
      );
    }
    res.json(
      `Golfer ${
        golfers[index].firstName + " " + golfers[index].lastName
      } was sucessfully deleted from JSON-file.`
    );
    golfers.splice(index, 1);
    await writeJsonData("./golfers.json", golfers);
  } else {
    throw new ResErr(404, "No golfers defined in datafile");
  }
});

// ERROR MIDDLEWARE
app.use((err, req, res, next) => {
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({ ErrorCode: statusCode, Message: err.message });
});

// LISTEN
app.listen(PORT, () => {
  console.log(`App is running on http://localhost:${PORT}`);
});
