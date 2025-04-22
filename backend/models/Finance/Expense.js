import mongoose from 'mongoose';

const ExpenseSchema = new mongoose.Schema({
    amount: Number,
    category: String,  // e.g., 'Inventory', 'Salaries', 'Utilities'
    date: Date,
    description: String
});

export default mongoose.model("Expense", ExpenseSchema);
