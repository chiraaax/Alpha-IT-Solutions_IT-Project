import mongoose from 'mongoose';

const InvoiceSchema = new mongoose.Schema({
    customerName: String,
    items: [{ name: String, price: Number, quantity: Number }],
    totalAmount: Number,
    status: { type: String, enum: ['Paid', 'Pending'], default: 'Pending' },
    date: Date
});

export default mongoose.model("Invoice", InvoiceSchema);
