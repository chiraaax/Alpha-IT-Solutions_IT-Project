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
      'coolers',
      'keyboard',
      'mouse',
      'soundSystems',
      'cables',
      'storage',
      'externalStorage'
    ]
  },
  price: { type: Number, required: true },
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
  specs: {
    type: Map,
    of: Schema.Types.Mixed,
    default: {}
  },
  image: { type: String, required: false },
  description: { type: String, required: true } 
}, { timestamps: true });

export default mongoose.model('Product', productSchema);
