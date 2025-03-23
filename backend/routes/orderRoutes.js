// routes/order.js
import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// POST /api/successorder - Process a successful order
router.post('/', async (req, res) => {
  const { orderId, products: orderedProducts } = req.body;

  // Validate the request body.
  if (!orderId || !orderedProducts || !Array.isArray(orderedProducts)) {
    return res.status(400).json({ message: 'orderId and orderedProducts are required.' });
  }

  try {
    // Process each ordered product.
    for (const orderItem of orderedProducts) {
      const { productId, quantity } = orderItem;

      // Decrement the product's stockCount by the ordered quantity.
      const updatedProduct = await Product.findByIdAndUpdate(
        productId,
        { $inc: { stockCount: -quantity } },
        { new: true }
      );

      // If the product is updated and its stockCount is below or equal to threshold, log an alert.
      if (updatedProduct && updatedProduct.stockCount <= updatedProduct.threshold) {
        console.log(`Alert: ${updatedProduct.description} (ID: ${updatedProduct._id}) is low in stock!`);
      }
    }

    // Optionally, you might store the order in a separate collection for order history.
    res.json({ message: 'Order processed successfully.' });
  } catch (error) {
    console.error('Error processing order:', error);
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

export default router;
