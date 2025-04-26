import express from "express";
import Transaction from "../../models/Finance/Transaction.js";

const router = express.Router();

// Get all transactions
router.get("/all", async (req, res) => {
    try {
        const transactions = await Transaction.find().sort({ date: -1 });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ message: "Error fetching transactions", error });
    }
});

// Add a new transaction
router.post("/add", async (req, res) => {
    try {
        const { amount, type, category, date, description } = req.body;
        const newTransaction = new Transaction({ amount, type, category, date, description });
        await newTransaction.save();
        res.status(201).json(newTransaction);
    } catch (error) {
        res.status(500).json({ message: "Error adding transaction", error });
    }
});

// Update a transaction
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const updatedTransaction = await Transaction.findByIdAndUpdate(id, req.body, { new: true });
        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: "Error updating transaction", error });
    }
});

// Delete a transaction
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const deletedTransaction = await Transaction.findByIdAndDelete(id);
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting transaction", error });
    }
});

export default router;
