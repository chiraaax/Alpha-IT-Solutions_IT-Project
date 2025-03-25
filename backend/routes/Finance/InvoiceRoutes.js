import express from 'express';
import Invoice from '../../models/Finance/Invoice.js';

const router = express.Router();

// Create an invoice
router.post('/invoices', async (req, res) => {
    try {
        const { customerName, items, totalAmount, status, date } = req.body;
        const newInvoice = new Invoice({
            customerName,
            items,
            totalAmount,
            status,
            date
        });

        await newInvoice.save();
        res.status(201).json(newInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all invoices
router.get('/invoices', async (req, res) => {
    try {
        const invoices = await Invoice.find();
        res.status(200).json(invoices);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get an invoice by ID
router.get('/invoices/:id', async (req, res) => {
    try {
        const invoice = await Invoice.findById(req.params.id);
        if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
        res.status(200).json(invoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update an invoice
router.put('/invoices/:id', async (req, res) => {
    try {
        const { customerName, items, totalAmount, status, date } = req.body;
        const updatedInvoice = await Invoice.findByIdAndUpdate(
            req.params.id,
            { customerName, items, totalAmount, status, date },
            { new: true }
        );
        if (!updatedInvoice) return res.status(404).json({ message: 'Invoice not found' });
        res.status(200).json(updatedInvoice);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete an invoice
router.delete('/invoices/:id', async (req, res) => {
    try {
        const deletedInvoice = await Invoice.findByIdAndDelete(req.params.id);
        if (!deletedInvoice) return res.status(404).json({ message: 'Invoice not found' });
        res.status(200).json({ message: 'Invoice deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
