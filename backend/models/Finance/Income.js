import mongoose from 'mongoose';

const IncomeSchema = new mongoose.Schema({
    amount: Number,
    source: String,  // e.g., 'Product Sale', 'Service'
    date: Date,
    description: String
});

export default mongoose.model("Income", IncomeSchema);
