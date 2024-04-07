import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import "dotenv/config";
import cors from "cors";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/validations.js";
import { UserController, PostController } from "./Controllers/index.js";
import { checkAuth, handleValidationErrors } from "./utils/index.js";

// Подключение к MongoDB
mongoose
  .connect(process.env.DB_CONN)
  .then(() => {
    console.log("DB OK");
  })
  .catch((err) => {
    console.log("DB error", err);
  });

// Создание сервера
const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "uploads");
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

app.use(express.json());
app.use(cors());
app.use("/uploads", express.static("uploads"));

// Логин
app.post(
  "/auth/login",
  loginValidation,
  handleValidationErrors,
  UserController.login
);
// Регистрация
app.post(
  "/auth/register",
  registerValidation,
  handleValidationErrors,
  UserController.register
);
// Получить инфу о пользователе
app.get("/auth/me", checkAuth, UserController.getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Получить все посты
app.get("/posts", PostController.getAll);
// Получить инфу о пользователе
app.get("/posts/:id", PostController.getOne);
// Создать пост
app.post(
  "/posts",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.create
);
// Удалить пост
app.delete("/posts/:id", checkAuth, PostController.remove);
// Обновить пост
app.patch(
  "/posts/:id",
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update
);

// Слушатель порта 4444
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server OK");
});
