import express from "express";
import { users } from "./data/users.js";
import asyncRoutes from "./routes/asyncRoutes.js";

const app = express();
app.use(express.json());

// --- Routes ---

// Get all users
app.get("/api/users", (req, res) => {
  res.json(users);
});

// Get user by ID
app.get("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

// Add new user
app.post("/api/users", (req, res, next) => {
  try {
    const { name, email } = req.body;

    if (name === 'xxx') {
        throw new Error("Ten phai khac cai ten nay: " + name);
    }

    const newUser = { id: users.length + 1, name, email };
    users.push(newUser);
    res.status(201).json(newUser);
  } catch (err) {
    next(err); // pass error to error handler
  }
});

// Update user
app.put("/api/users/:id", (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  res.json(user);
});

// Delete user
app.delete("/api/users/:id", (req, res) => {
  const index = users.findIndex(u => u.id === parseInt(req.params.id));
  if (index === -1) return res.status(404).json({ message: "User not found" });
  users.splice(index, 1);
  res.json({ message: "User deleted" });
});

// -- async -------
app.use("/api", asyncRoutes); // prefix all async routes with /api

// --- exception handler ----
app.use((err, req, res, next) => {
  console.error(err.stack); // log to console
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
