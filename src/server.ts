import dotenv from "dotenv";
import express from "express";
import rssRoutes from "./routes/rss.routes";

// Load environment variables
if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/", rssRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
