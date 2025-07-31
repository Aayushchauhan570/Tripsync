import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDB from "./config/DB.js";
import authRoutes from "./routes/authRoutes.js";
import tripRoutes from "./routes/tripRoutes.js"; 


dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



// all Routes 
app.use('/api',authRoutes);
app.use('/api/trips', tripRoutes); 


app.get("/", (req, res) => {
  res.send("Hello, World!");
});
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
