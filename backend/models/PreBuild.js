import mongoose from "mongoose";

const preBuildSchema = new mongoose.Schema({
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

    
    
});

const PreBuild = mongoose.model("PreBuild", preBuildSchema);

export default PreBuild;