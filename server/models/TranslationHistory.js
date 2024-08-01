// models/TranslationHistory.js
import mongoose from "mongoose";

const translationHistorySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to User model
  originalText: { type: String, required: true },
  translatedText: { type: String, required: true },
  sourceLanguage: { type: String, required: true },
  targetLanguage: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const TranslationHistory = mongoose.model("TranslationHistory", translationHistorySchema);
export default TranslationHistory;
