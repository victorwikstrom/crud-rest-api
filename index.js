import express from "express";
import bodyParser from "body-parser";
import golferRoutes from "./routes/golfers.js";

const app = express();
const PORT = 5000;

app.use(bodyParser.json());

app.use("/golfers", golferRoutes);

app.get("/", (req, res) => res.send("Hello from homepage"));
app.get("/test", (req, res) => res.send("Hello from test"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

// sdf
