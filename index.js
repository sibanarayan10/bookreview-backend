import { configDotenv } from "dotenv";
import express from "express";
import userRouter from "./router/User.router.js";
import bookRouter from "./router/Book.router.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectMongoDB } from "./connect/ConnectDb.js";

configDotenv({
  path: "./.env",
});
const app = express();
const corsOption = {
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOption));
app.use(express.json({ extended: true, limit: "16kb" }));
app.use(express.urlencoded());
app.use(cookieParser());
app.use(express.static("public"));

const port = process.env.PORT || 3001;

connectMongoDB()
  .then(() => {
    app.listen(port, () => {
      console.log("Server is listening at port", port);
    });
  })
  .catch((error) => {
    console.log("error", error);
  });

app.use("/api/v1/user", userRouter);
app.use("/api/v1/books", bookRouter);
