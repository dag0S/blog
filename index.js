import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { validationResult } from "express-validator";

import { registerValidation } from "./validations/auth.js";
import UserModal from "./models/user.js";

// Подключение к MongoDB
mongoose
  .connect(
    "mongodb+srv://admin:123123123@cluster0.82olslk.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
  )
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

// Регистрация
app.post("/auth/register", registerValidation, async (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      return res.status(400).json(errors.array());
    }

    const password = req.body.password;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);

    const doc = new UserModal({
      email: req.body.email,
      fullName: req.body.fullName,
      avatarUrl: req.body.avatarUrl,
      hash,
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secret123",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({
      ...userData,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Не удалось зарегистрироваться",
    });
  }
});

// Слушатель порта 4444
app.listen(4444, (err) => {
  if (err) {
    console.log(err);
  }
  console.log("Server OK");
});
