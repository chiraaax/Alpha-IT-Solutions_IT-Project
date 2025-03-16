import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products - Fetch all products with optional filters (category, price range, etc.)
router.get('/', async (req, res) => {
  try {
    const { category, minPrice, maxPrice, page = 1, limit = 12 } = req.query;
    const query = {};

    if (category) query.category = category;

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    // Count total matching products
    const totalCount = await Product.countDocuments(query);

    // Fetch products for the current page
    const products = await Product.find(query)
      .skip((page - 1) * Number(limit))
      .limit(Number(limit));

    // Expose the custom header so the client can read it
    res.setHeader('Access-Control-Expose-Headers', 'x-total-count');
    res.setHeader('x-total-count', totalCount);

    res.status(200).json(products);
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// GET /api/products/:id - Fetch a single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(product);
  } catch (error) {
    console.error("❌ Error fetching product:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// POST /api/products - Create a new product
router.post('/', async (req, res) => {
  try {
    const { category, price, availability, state, specs, image, description } = req.body;

    // Validate required fields
    if (!category || !price || !availability || !state) {
      return res.status(400).json({ message: "Category, price, availability, and state are required." });
    }

    // Ensure price is a positive number
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: "Price must be a positive number." });
    }

    // Ensure specs is a valid object
    if (specs && typeof specs !== "object") {
      return res.status(400).json({ message: "Specs must be an object." });
    }

    const newProduct = new Product({
      category,
      price: numericPrice,
      availability,
      state,
      specs,
      image,
      description
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("❌ Error adding product:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// PATCH /api/products/:id - Update an existing product
router.patch('/:id', async (req, res) => {
  try {
    const { price } = req.body;

    // Ensure price is a valid number if provided
    if (price !== undefined) {
      const numericPrice = parseFloat(price);
      if (isNaN(numericPrice) || numericPrice <= 0) {
        return res.status(400).json({ message: "Price must be a positive number." });
      }
      req.body.price = numericPrice;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!updatedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("❌ Error updating product:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// DELETE /api/products/:id - Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: 'Product not found' });

    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error("❌ Error deleting product:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

// GET /api/products/:id/related - Fetch related products (based on same category)
router.get('/:id/related', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const relatedProducts = await Product.find({
      category: product.category,
      _id: { $ne: product._id }
    }).limit(5);

    res.status(200).json(relatedProducts);
  } catch (error) {
    console.error("❌ Error fetching related products:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  }
});

export default router;
