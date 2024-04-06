import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import {
  registerValidation,
  loginValidation,
} from "./validations/validations.js";
import checkAuth from "./utils/checkAuth.js";
import { login, register, getMe } from "./Controllers/UserController.js";
import { create } from "./Controllers/PostController.js";

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

// Чтение json
app.use(express.json());

// Логин
app.post("/auth/login", loginValidation, login);
// Регистрация
app.post("/auth/register", registerValidation, register);
// Получить инфу о пользователе
app.get("/auth/me", checkAuth, getMe);

// Получить все посты
// app.get("/posts", getAll);
// Получить инфу о пользователе
// app.get("/posts/:id", getOne);
// Создать пост
app.post("/posts", create);
// Удалить пост
// app.delete("/posts", remove);
// Обновить пост
// app.patch("/posts", update);

// Слушатель порта 4444
app.listen(process.env.PORT, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server OK");
});
