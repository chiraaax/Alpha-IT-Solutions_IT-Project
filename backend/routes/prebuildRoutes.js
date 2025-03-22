import express from "express";
import PreBuild from "../models/PreBuild.js"; // Import the PreBuild model
import { body, validationResult } from "express-validator"; // For validation middleware

const router = express.Router();

// Validation middleware for creating/updating a prebuild
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

// ✅ Route to create a new prebuild
router.post("/create", validatePreBuild, async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { image, category, price, cpu, gpu, ram, storage, psu, casing, description } = req.body;

    const newPreBuild = new PreBuild({
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

    await newPreBuild.save();
    res.status(201).json({ message: "✅ Prebuild created successfully!", data: newPreBuild });
  } catch (error) {
    console.error("❌ Error creating prebuild:", error);
    res.status(500).json({ message: "🚨 Internal Server Error while creating prebuild.", error: error.message });
  }
});

// ✅ Route to get all prebuilds
router.get("/", async (req, res) => {
  console.log("Fetching all prebuilds..."); // Log when this route is triggered
  try {
    const preBuilds = await PreBuild.find();
    res.status(200).json({ message: "✅ Fetched all prebuilds successfully!", data: preBuilds });
  } catch (error) {
    console.error("❌ Error fetching prebuilds:", error);
    res.status(500).json({ message: "🚨 Server error while fetching prebuilds.", error: error.message });
  }
});

// ✅ Route to get prebuilds by category
router.get("/category/:category", async (req, res) => {
  const { category } = req.params;

  console.log(`Fetching prebuilds for category: ${category}`); // Log when this route is triggered

  try {
    const preBuilds = await PreBuild.find({ category: { $regex: new RegExp(category, "i") } });

    if (!preBuilds.length) {
      return res.status(404).json({ message: `❌ No prebuilds found for category: ${category}` });
    }

    res.status(200).json({ message: "✅ Prebuilds fetched successfully!", data: preBuilds });
  } catch (error) {
    console.error("❌ Error fetching prebuilds by category:", error);
    res.status(500).json({ message: "🚨 Server error while fetching prebuilds by category.", error: error.message });
  }
});

// ✅ Route to get prebuild by ID
router.get("/:id", async (req, res) => {
  console.log(`Fetching prebuild with ID: ${req.params.id}`); // Log when this route is triggered
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

// ✅ Route to update a prebuild by ID
router.put("/:id", validatePreBuild, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { image, category, price, cpu, gpu, ram, storage, psu, casing, description } = req.body;

    const updatedBuild = await PreBuild.findByIdAndUpdate(
      req.params.id,
      {
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
      },
      { new: true, runValidators: true }
    );

    if (!updatedBuild) {
      return res.status(404).json({ message: "❌ Build not found!" });
    }

    res.status(200).json({ message: "✅ Build updated successfully!", data: updatedBuild });
  } catch (error) {
    console.error("❌ Error updating prebuild:", error);
    res.status(500).json({ message: "🚨 Server error while updating prebuild.", error: error.message });
  }
});

// ✅ Route to delete a prebuild by ID
router.delete("/:id", async (req, res) => {
  console.log(`Deleting prebuild with ID: ${req.params.id}`); // Log when this route is triggered
  try {
    const deletedBuild = await PreBuild.findByIdAndDelete(req.params.id);

    if (!deletedBuild) {
      return res.status(404).json({ message: "❌ Build not found!" });
    }

    res.status(200).json({ message: "✅ Build deleted successfully!", data: deletedBuild });
  } catch (error) {
    console.error("❌ Error deleting prebuild:", error);
    res.status(500).json({ message: "🚨 Server error while deleting prebuild.", error: error.message });
  }
});

export default router;
