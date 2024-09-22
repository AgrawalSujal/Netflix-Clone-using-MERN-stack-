import express from "express";
import dotenv from "dotenv";
import userRouter from "../backend/routes/userRoutes.js";
import mongooseConnection from "./utils/database.js";
import cors from "cors";
dotenv.config({});

const app = express();
const PORT = process.env.PORT || 5000;

console.log(process.env.MONGO_URI);

app.use(express.json());
app.use(express.urlencoded({ extended: true })); // Corrected middleware
mongooseConnection();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

app.use(cors(corsOptions));
app.use("/api/v1/user", userRouter);
app.listen(PORT, () => {
  console.log(`Server started successfully at ${PORT}`);
});
