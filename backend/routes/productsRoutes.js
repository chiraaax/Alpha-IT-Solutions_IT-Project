import express from 'express';
import Product from '../models/Product.js';

const router = express.Router();

// GET /api/products - Fetch all products with optional filters (category, price range, etc.)
router.get('/', async (req, res) => {
  try {
    const {
      category,
      minPrice,
      maxPrice,
      availability,
      state,
      brand,
      page = 1,
      limit = 99990000000000,
      ...extraFilters
    } = req.query;

    const filterQuery = {};

    // Apply category filter
    if (category) filterQuery.category = category;

    // Apply price filter
    if (minPrice || maxPrice) {
      filterQuery.price = {};
      if (minPrice) filterQuery.price.$gte = parseFloat(minPrice);
      if (maxPrice) filterQuery.price.$lte = parseFloat(maxPrice);
    }

    // Apply availability and state filters
    if (availability) filterQuery.availability = availability;
    if (state) filterQuery.state = state;

    // Initialize $and for specs filters
    filterQuery.$and = [];

    // Map brand filter to a specs filter if category is provided.
    if (brand && category) {
      const brandArray = Array.isArray(brand) ? brand : [brand];
      const brandKey = `${category}Brand`;
      filterQuery.$and.push({
        specs: { $elemMatch: { key: brandKey, value: { $in: brandArray } } }
      });
    }

    // Process extraFilters: treat every extra filter as a specs filter.
    for (const key in extraFilters) {
      if (extraFilters.hasOwnProperty(key) && extraFilters[key]) {
        let value = extraFilters[key];

        // Convert to an array if the value is a comma-separated string.
        if (typeof value === 'string') {
          value = value.split(',');
        }
        if (!Array.isArray(value)) {
          value = [value];
        }

        // If the key has a "specs." prefix, remove it. Otherwise use the key as is.
        const specKey = key.startsWith('specs.') ? key.split('.')[1] : key;

        // Push this condition into the $and array.
        filterQuery.$and.push({
          specs: { $elemMatch: { key: specKey, value: { $in: value } } }
        });
      }
    }

    // If no specs filters were added, remove $and from the query.
    if (filterQuery.$and.length === 0) {
      delete filterQuery.$and;
    }

    console.log('Final MongoDB Query:', JSON.stringify(filterQuery, null, 2));

    // Query the database using the filter
    const products = await Product.find(filterQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    // Send the response with products
    res.json(products);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Error fetching products' });
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
router.patch('/:productId', async (req, res) => {
  try {
    // Check if the request body is empty
    if (Object.keys(req.body).length === 0) {
      return res.status(400).json({ message: "Request body cannot be empty." });
    }

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
      req.params.productId,
      { $set: req.body },
      { new: true, runValidators: true } // runValidators ensures schema rules are enforced
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

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

// GET /api/products/:id - Fetch related products (based on same category)
router.get('/:productId', async (req, res) => {
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
