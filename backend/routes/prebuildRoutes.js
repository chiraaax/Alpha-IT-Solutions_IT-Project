import express from "express";
import PreBuild from "../models/PreBuild.js"; // Import the PreBuild model
import { body, validationResult } from "express-validator"; // For validation middleware

const router = express.Router();

// Validation middleware for creating a prebuild
const validatePreBuild = [
  body("image").notEmpty().withMessage("Image URL is required."),
  body("category").notEmpty().withMessage("Category is required."),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number."),
  body("cpu").notEmpty().withMessage("CPU is required."),
  body("gpu").notEmpty().withMessage("GPU is required."),
  body("ram").notEmpty().withMessage("RAM is required."),
  body("storage").notEmpty().withMessage("Storage is required."),
  body("psu").notEmpty().withMessage("PSU is required."),
  body("casing").notEmpty().withMessage("Casing is required."),
  body("description").notEmpty().withMessage("Description is required."),
];

// Route to create a new prebuild
router.post("/create", validatePreBuild, async (req, res) => {
  const errors = validationResult(req);

  // If validation errors exist, return a 400 response
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { image, category, price, cpu, gpu, ram, storage, psu, casing, description } = req.body;

    // Trim inputs to avoid unnecessary whitespace and ensure proper data format
    const newPreBuild = new PreBuild({
      image: image.trim(),
      category: category.trim(),
      price: parseFloat(price), // Ensure price is a number
      cpu: cpu.trim(),
      gpu: gpu.trim(),
      ram: ram.trim(),
      storage: storage.trim(),
      psu: psu.trim(),
      casing: casing.trim(),
      description: description.trim(),
    });

    // Save to the database
    await newPreBuild.save();

    // Respond with success message
    res.status(201).json({ message: "✅ Prebuild created successfully!", data: newPreBuild });
  } catch (error) {
    console.error("❌ Error creating prebuild:", error);

    // Send detailed error response
    res.status(500).json({
      message: "🚨 Internal Server Error while creating prebuild.",
      error: error.message,
    });
  }
});

// Route to get all prebuilds
router.get("/", async (req, res) => {
  try {
    const preBuilds = await PreBuild.find();
    res.status(200).json({ message: "✅ Fetched all prebuilds successfully!", data: preBuilds });
  } catch (error) {
    console.error("❌ Error fetching prebuilds:", error);
    res.status(500).json({
      message: "🚨 Server error while fetching prebuilds.",
      error: error.message,
    });
  }
});

// Route to get prebuilds by category (e.g., Gaming)
router.get("/category/:category", async (req, res) => {
  const { category } = req.params; // Capture the category from the URL

  try {
    const preBuilds = await PreBuild.find({ category: { $regex: new RegExp(category, "i") } });

    if (!preBuilds || preBuilds.length === 0) {
      return res.status(404).json({ message: `❌ No prebuilds found for category: ${category}` });
    }

    res.status(200).json({ message: "✅ Prebuilds fetched successfully!", data: preBuilds });
  } catch (error) {
    console.error("❌ Error fetching prebuilds by category:", error);
    res.status(500).json({
      message: "🚨 Server error while fetching prebuilds by category.",
      error: error.message,
    });
  }
});

// Route to get all prebuilds (Custom category is now redundant)
router.get("/custom", async (req, res) => {
  try {
    const builds = await PreBuild.find().lean(); // Use PreBuild model here
    res.status(200).json({ message: "✅ Fetched all prebuilds successfully!", data: builds });
  } catch (error) {
    console.error("❌ Error fetching prebuilds:", error);
    res.status(500).json({ message: "🚨 Server error while fetching prebuilds.", error: error.message });
  }
});

// Route to get prebuild by ID
router.get("/:id", async (req, res) => {
  try {
    const build = await PreBuild.findById(req.params.id);

    if (!build) {
      return res.status(404).json({ message: "❌ Build not found!" });
    }

    res.status(200).json({ message: "✅ Build fetched successfully!", data: build });
  } catch (error) {
    console.error("❌ Error fetching prebuild:", error);
    res.status(500).json({ message: "🚨 Server error while fetching prebuild.", error: error.message });
  }
});

// Route to create a new prebuild (custom creation removed as it's redundant now)
router.post("/createCustom", async (req, res) => {
  const { image, category, price, cpu, gpu, ram, storage, psu, casing, description } = req.body;

  if (!image || !category || !price || !cpu || !gpu || !ram || !storage || !psu || !casing || !description) {
    return res.status(400).json({ message: "⚠️ All fields are required!" });
  }

  try {
    const newBuild = new PreBuild({
      image: image.trim(),
      category: category.trim(),
      price: parseFloat(price),
      cpu: cpu.trim(),
      gpu: gpu.trim(),
      ram: ram.trim(),
      storage: storage.trim(),
      psu: psu.trim(),
      casing: casing.trim(),
      description: description.trim(),
    });

    await newBuild.save();

    res.status(201).json({ message: "✅ Prebuild created successfully!", data: newBuild });
  } catch (error) {
    console.error("❌ Error creating prebuild:", error);
    res.status(500).json({ message: "🚨 Error creating prebuild.", error: error.message });
  }
});

export default router;
