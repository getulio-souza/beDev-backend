const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

mongoose.connect("mongodb://localhost:3001/login", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  password: String,
});

const User = mongoose.model("User", userSchema);

app.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({
        message: "Usuario ja existe",
      });
    }

    //hash the password
    const hashedPassoword = await bcrypt.hash(password, 10);

    //create a new user
    const newUser = new User({
      username,
      password: hashedPassoword,
    });

    //save the user to the database
    await newUser.save();

    res.json({
      message: "cadastro feito com sucesso",
    });
  } catch (error) {
    console.error("Falha no cadastro:", error.message);
    res.status(500).json({
      message: "internal server error",
    });
  }
});

app.listen(PORT, () => {
  console.log(`servidor rodando on http://localhost:${PORT}`);
});