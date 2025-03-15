import React, { useState } from 'react';
import ProductCards from './ProductCards';
import products from '../../data/products';

const OfferedProducts = () => {
  // Filter the products to include only those with an oldPrice value
  const specialOfferProducts = products.filter(product => product.oldPrice != null);

  // this is used to limit the number of products displayed on the page
  const [visibleProducts, setVisibleProducts] = useState(8);
  const loadMoreProducts = () => {
    setVisibleProducts(prevCount => prevCount + 4);
  };

  return (
    <div className='bg-black pb-3'>
      <section className='section__container product__container'>
        <h2 className='section__header'>Special offers</h2>
        <p className='section__subheader mb-12'>
          Get the best deals on high-performance laptops, gaming accessories, and essential tech upgrades—only at Alpha IT Solutions!
        </p>
        
        {/* Render only the filtered products */}
        <ProductCards products={specialOfferProducts.slice(0, visibleProducts)} />

        {/* Load more products */}
        <div className='product__btn'>
          {visibleProducts < specialOfferProducts.length && (
            <button className='btn' onClick={loadMoreProducts}>Load more</button>
          )}
        </div>
      </section>
    </div>
  );
};

export default OfferedProducts;
