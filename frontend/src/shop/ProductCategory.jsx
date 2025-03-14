import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import ProductCards from './ProductCards';
import products from '../data/products.json';

const ProductCategory = () => {
    const { category } = useParams(); // Get the category from the URL
    const [selectedColor, setSelectedColor] = useState('');
    const [priceRange, setPriceRange] = useState([0, 2000]);

    // Filter products based on category
    const filteredProducts = products.filter(product => {
        return (
            product.category === category &&
            (selectedColor ? product.color === selectedColor : true) &&
            (product.price >= priceRange[0] && product.price <= priceRange[1])
        );
    });

    return (
        <div className='bg-black pb-3'>
            <section className='section__container product__container'>
                <h2 className='section__header text-white capitalize'>{category} Products</h2>

                {/* Filters */}
                <div className='flex flex-col gap-4 mb-6'>
                    {/* Color Filter */}
                    <div>
                        <h4 className='text-white'>Color</h4>
                        {['black', 'red', 'gold', 'silver'].map(color => (
                            <label key={color} className='text-white flex items-center gap-2'>
                                <input
                                    type='radio'
                                    name='color'
                                    value={color}
                                    checked={selectedColor === color}
                                    onChange={() => setSelectedColor(color)}
                                />
                                {color.charAt(0).toUpperCase() + color.slice(1)}
                            </label>
                        ))}
                    </div>

                    {/* Price Range Filter */}
                    <div>
                        <h4 className='text-white'>Price Range</h4>
                        <input
                            type='range'
                            min='0'
                            max='2000'
                            value={priceRange[1]}
                            onChange={(e) => setPriceRange([0, Number(e.target.value)])}
                            className='cursor-pointer'
                        />
                        <span className='text-white'>Up to ${priceRange[1]}</span>
                    </div>
                </div>

                {/* Filtered Products */}
                <ProductCards products={filteredProducts} />
            </section>
        </div>
    );
};

export default ProductCategory;
