const express = require('express')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const app = express()
app.use(express.json());

const users = [];
const JWT_SECRET = "I LOVE ARJOO WITH MU SOUL";


app.post("/signup", async function (req, res) {
  try {
    const name = req.body.name;
    const password = req.body.password;

    // 1. Check input
    if (!name || !password) {
      return res.status(400).json({
        message: "Name aur password dono required hain"
      });
    }

    // 2. Check if user already exists
    const existingUser = users.find((user) => user.name === name);

    if (existingUser) {
      return res.status(409).json({
        message: "User already exists"
      });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user
    users.push({
      name: name,
      password: hashedPassword
    });

    // 5. Send response
    res.status(201).json({
      message: "Signup successful"
    });

  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

app.post("/signin", async function (req, res) {
  try {
    const name = req.body.name;
    const password = req.body.password;

    if (!name || !password) {
      return res.status(400).json({
        message: "Name aur password dono required hain"
      });
    }

    const user = users.find((u) => u.name === name);

    if (!user) {
      return res.status(404).json({
        message: "User not found, pehle signup karo"
      });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        message: "Invalid password"
      });
    }

    const token = jwt.sign(
      { name: user.name },
      JWT_SECRET
    );

    return res.status(200).json({
      message: "Signin successful",
      token: token
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      error: error.message
    });
  }
});

app.listen(3000);