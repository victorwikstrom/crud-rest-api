import express from "express";

const router = express.Router();

const golfers = [
  {
    id: "1",
    firstName: "Phil",
    lastName: "Mickelson",
    age: "54",
    mainSponsor: "Callaway",
  },
  {
    id: "2",
    firstName: "Justin",
    lastName: "Thomas",
    age: "28",
    mainSponsor: "Titleist",
  },
  {
    id: "3",
    firstName: "Dustin",
    lastName: "Johnson",
    age: "32",
    mainSponsor: "TaylorMade",
  },
];

// all routes in here are starting with /golfer
router.get("/", (req, res) => {
  res.send(golfers);
});

router.post("/", (res, req) => {});

export default router;
