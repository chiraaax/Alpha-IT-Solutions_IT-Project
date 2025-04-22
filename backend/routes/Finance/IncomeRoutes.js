import express from "express";
import Income from "../../models/Finance/Income.js";

const router = express.Router();

// Get all incomes
router.get("/all", async (req, res) => {
    try {
        const incomes = await Income.find();
        res.json(incomes);
    } catch (err) {
        res.status(500).json({ error: "Error fetching incomes" });
    }
});

// Add income
router.post("/add", async (req, res) => {
    try {
        const newIncome = new Income(req.body);
        await newIncome.save();
        res.json(newIncome);
    } catch (err) {
        res.status(500).json({ error: "Error adding income" });
    }
});

// Update income
router.put("/:id", async (req, res) => {
    try {
        const updatedIncome = await Income.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedIncome);
    } catch (err) {
        res.status(500).json({ error: "Error updating income" });
    }
});

// Delete income
router.delete("/:id", async (req, res) => {
    try {
        await Income.findByIdAndDelete(req.params.id);
        res.json({ message: "Income deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting income" });
    }
});

export default router;
