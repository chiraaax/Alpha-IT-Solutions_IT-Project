import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    amount: Number,
    type: {
        type: String,
        enum: ['Income', 'Expense'], // Choose between Income or Expense
        required: true
    },
    category: String, // For Expense: 'Inventory', 'Salaries' etc. For Income: 'Product Sale', etc.
    date: {
        type: Date,
        default: Date.now
    },
    description: String
});

export default mongoose.model("Transaction", TransactionSchema);
