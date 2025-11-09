import { users } from "../data/users.js";
import express from "express";

// routes/asyncRoutes.js
const router = express.Router();

// Reusable async handler
const handler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

// Example async POST /users
router.post("/async/users", handler(async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    const err = new Error("Name and email are required");
    err.statusCode = 400;
    throw err;
  }

  if (name === "xxx") {
    const err = new Error("Tên phải khác cái tên này: " + name);
    err.statusCode = 400;
    throw err;
  }

  // Simulate async DB call
  await new Promise(r => setTimeout(r, 1000));

  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);

  res.status(201).json({ success: true, user: newUser });
}));

export default router;
