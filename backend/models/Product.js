import mongoose from 'mongoose';
const { Schema } = mongoose;

const productSchema = new Schema({
  category: {
    type: String,
    required: true,
    enum: [
      'laptop',
      'motherboard',
      'processor',
      'ram',
      'gpu',
      'powerSupply',
      'casings',
      'monitors',
      'cpuCoolers',
      'keyboard',
      'mouse',
      'soundSystems',
      'cablesConnectors',
      'storage',
      'externalStorage'
    ]
  },
  price: { type: Number, required: true },
  // New inventory-specific fields:
  discount: { type: Number, default: 0 },
  // discountPrice is computed as price - (price * discount/100)
  discountPrice: { 
    type: Number, 
    required: true,
    default: function() {
      return this.price;
    } 
  },
  stockCount: { type: Number, default: 0 },
  threshold: { type: Number, default: 1 },
  displayedStock: { type: Number, default: 0 },

  // Existing fields
  availability: {
    type: String,
    required: true,
    enum: ['out of stock', 'in stock', 'pre-order']
  },
  state: {
    type: String,
    required: true,
    enum: ['new', 'used', 'refurbished']
  },
  specs: [
    {
      key: { type: String, required: true }, 
      value: { type: String, required: true } 
    }
  ],
  image: { type: String },
  description: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
