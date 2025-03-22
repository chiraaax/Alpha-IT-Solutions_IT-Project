import CustomPreBuild from "../models/CustomPreBuild.js"; // Import the CustomPreBuild model

// Get all Custom Pre-Builds
export const getAllCustomPreBuilds = async (req, res) => {
  try {
    const builds = await CustomPreBuild.find().lean(); // Use .lean() for better performance
    res.status(200).json({ message: "✅ Fetched all builds successfully!", data: builds });
  } catch (error) {
    console.error("❌ Error fetching builds:", error);
    res.status(500).json({ message: "🚨 Server error while fetching builds.", error: error.message });
  }
};

// Get a single Custom Pre-Build by ID
export const getCustomPreBuildById = async (req, res) => {
  try {
    const build = await CustomPreBuild.findById(req.params.id);

    if (!build) {
      return res.status(404).json({ message: "❌ Build not found!", data: null });
    }

    res.status(200).json({ message: "✅ Build fetched successfully!", data: build });
  } catch (error) {
    console.error("❌ Error fetching build:", error);
    res.status(500).json({ message: "🚨 Server error while fetching build.", error: error.message });
  }
};

// Create a new Custom Pre-Build
export const createCustomPreBuild = async (req, res) => {
  const { image, category, price, cpu, gpu, ram, storage, psu, casing, description } = req.body;

  // Validate required fields
  if (!image || !category || !price || !cpu || !gpu || !ram || !storage || !psu || !casing || !description) {
    return res.status(400).json({ message: "⚠️ All fields are required!" });
  }

  try {
    // Create new build object
    const newBuild = new CustomPreBuild({
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

    // Save the new build to the database
    await newBuild.save();
    
    res.status(201).json({ message: "✅ Build created successfully!", data: newBuild });
  } catch (error) {
    console.error("❌ Error creating build:", error);
    res.status(500).json({ message: "🚨 Error creating build.", error: error.message });
  }
};

// Update a Custom Pre-Build
export const updateCustomPreBuild = async (req, res) => {
  try {
    const updatedBuild = await CustomPreBuild.findByIdAndUpdate(req.params.id, req.body, { new: true });

    if (!updatedBuild) {
      return res.status(404).json({ message: "❌ Build not found!" });
    }

    res.status(200).json({ message: "✅ Build updated successfully!", data: updatedBuild });
  } catch (error) {
    console.error("❌ Error updating build:", error);
    res.status(500).json({ message: "🚨 Error updating build.", error: error.message });
  }
};

// Delete a Custom Pre-Build
export const deleteCustomPreBuild = async (req, res) => {
  try {
    const deletedBuild = await CustomPreBuild.findByIdAndDelete(req.params.id);

    if (!deletedBuild) {
      return res.status(404).json({ message: "❌ Build not found!" });
    }

    res.status(200).json({ message: "✅ Build deleted successfully!", data: deletedBuild });
  } catch (error) {
    console.error("❌ Error deleting build:", error);
    res.status(500).json({ message: "🚨 Error deleting build.", error: error.message });
  }
};
