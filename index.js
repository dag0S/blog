import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import "dotenv/config";

import {
  registerValidation,
  loginValidation,
  postCreateValidation,
} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";
import { login, register, getMe } from "./Controllers/UserController.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./Controllers/PostController.js";

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

// Чтение json
app.use(express.json());
app.use("/uploads", express.static("uploads"));

// Логин
app.post("/auth/login", loginValidation, login);
// Регистрация
app.post("/auth/register", registerValidation, register);
// Получить инфу о пользователе
app.get("/auth/me", checkAuth, getMe);

app.post("/upload", checkAuth, upload.single("image"), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

// Получить все посты
app.get("/posts", getAll);
// Получить инфу о пользователе
app.get("/posts/:id", getOne);
// Создать пост
app.post("/posts", checkAuth, postCreateValidation, create);
// Удалить пост
app.delete("/posts/:id", checkAuth, remove);
// Обновить пост
app.patch("/posts/:id", postCreateValidation, checkAuth, update);

// Слушатель порта 4444
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server OK");
});

// 1: 50
