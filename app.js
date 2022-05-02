// Express
const express = require("express");

// Call express function
const app = express();

// Port - Use either port provided by the environment or 3000
const port = process.env.port || 3000;

// Bcrypt
const bcrypt = require("bcrypt");

// JSON parser
app.use(express.json());

// Users array
const users = [];

// Get users
app.get("/users", (req, res) => {
  res.json(users);
});

// Create user
app.post("/users", async (req, res) => {
  try {
    // Generate salt of default size
    const salt = await bcrypt.genSalt();

    // Hash the password
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    // Push to the array
    users.push({ name: req.body.name, password: hashedPassword });
    res.status(200).send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Login
app.post("/users/login", async (req, res) => {
  // Check if name and password are filled
  if (!req.body.name || !req.body.password) {
    res.status(400).send("Name and password are required");
  }

  // Find user by name
  const user = users.find((user) => (user.name = req.body.name));

  // Check if user found
  if (!user) return res.status(400).send("Account not found");

  // Compare password
  try {
    if (await bcrypt.compare(req.body.password, user.password)) {
      res.status(200).send("Success");
    } else {
      res.status(404).send("Not authorized");
    }
  } catch (error) {
    res.status(500).send(error);
  }
});
// Listen
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
