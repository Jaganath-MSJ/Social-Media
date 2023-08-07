import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import userRouter from "./routes/userRoutes.js";
import postRouter from "./routes/postRoutes.js";

const URL = process.env.PORT || 8000;

const app = express();
dotenv.config();
app.use(
  cors({
    origin: "https://msj-social-media.netlify.app",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

app.use("/api/auth", userRouter);
app.use("/api/post", postRouter);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Mongo DB Connected successfully");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.listen(process.env.PORT, () => {
  console.log(`Server started on port ${process.env.PORT}`);
});
