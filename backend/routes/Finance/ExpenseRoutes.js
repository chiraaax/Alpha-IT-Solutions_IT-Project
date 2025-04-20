import express from "express";
import Expense from "../../models/Finance/Expense.js";

const router = express.Router();

// Add Expense Route
router.post('/add', async (req, res) => {
    try {
        let { amount, category, date, description } = req.body;

        // Ensure required fields are present
        if (!amount || !category || !date) {
            return res.status(400).json({ error: "All required fields must be filled" });
        }

        // Validate amount
        if (isNaN(amount)) {
            return res.status(400).json({ error: "Amount must be a valid number" });
        }

        // Convert date string to Date object
        date = new Date(date);
        if (isNaN(date.getTime())) {
            return res.status(400).json({ error: "Invalid date format" });
        }

        const newExpense = new Expense({ amount, category, date, description });
        await newExpense.save();

        res.status(201).json({ message: 'Expense added successfully', expense: newExpense });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch All Expenses
router.get('/all', async (req, res) => {
    try {
        const expenses = await Expense.find().sort({ date: -1 }); // Sort by latest expenses
        res.status(200).json(expenses);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Fetch Single Expense by ID
router.get('/:id', async (req, res) => {
    try {
        const expense = await Expense.findById(req.params.id);
        if (!expense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.status(200).json(expense);
    } catch (err) {
        res.status(400).json({ error: "Invalid expense ID" });
    }
});

// Delete Expense by ID
router.delete('/:id', async (req, res) => {
    try {
        const deletedExpense = await Expense.findByIdAndDelete(req.params.id);
        if (!deletedExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }
        res.status(200).json({ message: "Expense deleted successfully" });
    } catch (err) {
        res.status(400).json({ error: "Invalid expense ID" });
    }
});

// Update Expense by ID
router.put('/:id', async (req, res) => {
    try {
        let { amount, category, date, description } = req.body;

        // Validate amount if provided
        if (amount !== undefined && isNaN(amount)) {
            return res.status(400).json({ error: "Amount must be a valid number" });
        }

        // Convert date if provided
        if (date) {
            date = new Date(date);
            if (isNaN(date.getTime())) {
                return res.status(400).json({ error: "Invalid date format" });
            }
        }

        const updatedExpense = await Expense.findByIdAndUpdate(
            req.params.id,
            { amount, category, date, description },
            { new: true, runValidators: true }
        );

        if (!updatedExpense) {
            return res.status(404).json({ error: "Expense not found" });
        }

        res.status(200).json({ message: "Expense updated successfully", updatedExpense });
    } catch (err) {
        res.status(400).json({ error: "Invalid expense ID" });
    }
});

export default router;
