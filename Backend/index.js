import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import Ticker from "./models/Data.model.js";

const app = express();
const port = 3000;
app.use(cors());

const mongoURI = "mongodb://localhost:27017/cryptoData";

mongoose
  .connect(mongoURI)
  .then(async () => {
    console.log("Connected to MongoDB");
    const response = await fetch("https://api.wazirx.com/api/v2/tickers");
    const data = await response.json();
    const top10Results = Object.values(data).slice(0, 10);
    await storeInMongoDB(top10Results);
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB", err);
  });

app.get("/fetchData", async (req, res) => {
  try {
    const dataDB = await Ticker.find().select("-_id -__v").limit(10);
    res.json({
      success: true,
      message: "Data fetched and stored successfully.",
      info: dataDB,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
});

async function storeInMongoDB(data) {
  await Ticker.insertMany(data);
}
