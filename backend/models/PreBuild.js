import mongoose from "mongoose";

// Schema definition for PreBuilds
const preBuildSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["Gaming", "Budget"],
      default: "Gaming",
    },
    price: {
      type: Number,
      required: true,
      min: 0, // Ensure price is non-negative
    },
    cpu: {
      type: String,
      required: true,
    },
    gpu: {
      type: String,
      required: true,
    },
    ram: {
      type: String,
      required: true,
    },
    storage: {
      type: String,
      required: true,
    },
    psu: {
      type: String,
      required: true,
    },
    casing: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

// Creating the PreBuild model using the schema
const PreBuild = mongoose.model("PreBuild", preBuildSchema);

export default PreBuild;
