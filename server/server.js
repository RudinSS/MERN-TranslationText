import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "./models/User.js"; // Ensure this path is correct
import TranslationHistory from "./models/TranslationHistory.js"; // Ensure this path is correct
// Import node-fetch using ES module syntax
import fetch from "node-fetch";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.error("Error connecting to MongoDB:", error));

// User registration route
app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();
    res.status(201).send("User registered successfully");
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).send(`Error registering user: ${error.message}`);
  }
});

// User login route
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send("Invalid username or password");
    }
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).send("Invalid username or password");
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).send("Error logging in user");
  }
});

// Middleware to authenticate JWT
const authenticateToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).send("Access denied");
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).send("Invalid token");
  }
};

// Translation route
app.get("/api", authenticateToken, async (req, res) => {
  try {
    const { text, source, target } = req.query;
    const url = `https://api.mymemory.translated.net/get?q=${text}&langpair=${source}|${target}`;
    const response = await fetch(url);
    const json = await response.json();
    const matches = await json.matches;
    const translatedText = matches[matches.length - 1].translation || "No translation found";
    res.send(translatedText);
  } catch (error) {
    console.log(error);
    res.send("Something went wrong!");
  }
});

// Save translation history
app.post("/api/translate", authenticateToken, async (req, res) => {
  const { originalText, translatedText, sourceLanguage, targetLanguage } = req.body;
  try {
    const newTranslation = new TranslationHistory({
      user: req.user.id, // Associate with logged-in user
      originalText,
      translatedText,
      sourceLanguage,
      targetLanguage,
    });
    await newTranslation.save();
    res.status(200).send("Translation saved successfully");
  } catch (error) {
    console.error("Error saving translation:", error);
    res.status(500).send("Error saving translation");
  }
});

// Fetch translation history for a user
app.get("/api/history", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const history = await TranslationHistory.find({ user: userId }).sort({ createdAt: -1 });
    res.json(history);
  } catch (error) {
    console.error("Error fetching translation history:", error);
    res.status(500).send("Error fetching translation history");
  }
});

// Delete translation history
app.delete("/api/history/:id", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const translationId = req.params.id;
    const deletedTranslation = await TranslationHistory.findOneAndDelete({
      _id: translationId,
      user: userId,
    });

    if (!deletedTranslation) {
      return res.status(404).send("Translation history not found");
    }

    const updatedHistory = await TranslationHistory.find({ user: userId }).sort({ createdAt: -1 });
    res.json(updatedHistory);
  } catch (error) {
    console.error("Error deleting translation history:", error);
    res.status(500).send("Error deleting translation history");
  }
});

// Profile route
app.get("/api/profile", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ username: user.username, email: user.email });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Add this route to your existing Express server setup
app.post("/api/change-password", authenticateToken, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  const userId = req.user.id;

  try {
    // Fetch user from database
    const user = await User.findById(userId);

    // Check if old password matches
    const validPassword = await bcrypt.compare(oldPassword, user.password);
    if (!validPassword) {
      return res.status(400).send("Old password is incorrect");
    }

    // Hash the new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password in database
    user.password = hashedNewPassword;
    await user.save();

    res.status(200).send("Password changed successfully");
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).send("Error changing password");
  }
});

// Update user profile route
app.put("/api/profile", authenticateToken, async (req, res) => {
  const { newUsername } = req.body;
  const userId = req.user.id;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update the username
    user.username = newUsername;

    // Save the updated user
    await user.save();

    // Respond with a success message
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Error updating profile" });
  }
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
