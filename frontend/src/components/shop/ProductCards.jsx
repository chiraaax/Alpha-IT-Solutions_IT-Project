import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'


const ProductCards = ({ products }) => { // Provide default empty array
  const dispatch = useDispatch();

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product, index) => (
        <div key={index} className="product__card__content">
          <div className="relative">
            <Link to={`/shop/${product._id}`}>
              <img
                src={product.image}
                alt="Product Image"
                className="max-h-96 md:h-64 w-full object-cover hover:scale-105 transition-all duration-300 p-3"
              />
            </Link>
          </div>
          {/* Product Details */}
          <div>
            <h4>{product.name}</h4>
            {/* Dynamic product description */}
            {product.description && (
              <p className=" text-gray-900 text-xl pl-4 font-sans">{product.description}</p>
            )}
            <p className="text-sm text-gray-600 text-xl pl-5 pt-4" >
              LKR {product.price}{" "}
              {product.oldPrice ? <s>LKR {product.oldPrice}</s> : null}
            </p>
          </div>
          <div className="hover:block m-5">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleAddToCart(product);
              }}
            >
              <i className="ri-shopping-cart-line bg-black text-white hover:bg-primary-dark p-3 m-8 rounded-3xl align-middle ml-11"></i>
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductCards;
