import React from 'react'
import {useState} from 'react'
import ProductCards from './ProductCards'
import products from '../data/products'

const TrendingProducts = () => {
    // this is used to limit the number of products displayed on the page
    const [visibleProducts, setVisibleProducts] = useState(8);
    const loadMoreProducts =() => {
        setVisibleProducts(prevCount => prevCount + 4);
    }
  return (
    <div className='bg-black pb-3 '>
    <section className='section__container product__container'>
        <h2 className='section__header'>Special offers</h2>
        <p className='section__subheader mb-12'>Discover the latest and most popular products, from innovative gadgets to stylish accessories, all in one place at ezyShopper!</p>
    
        {/* products card */}
        <ProductCards products
         = {products.slice(0,visibleProducts)}/>

        {/* load more products */}
        <div className='product__btn'>
            {
                visibleProducts < products.length && (
                    <button className='btn' onClick={loadMoreProducts}>Load more</button>
                )
            }
        </div>
    </section>
    </div>
  )
}

export default TrendingProducts;