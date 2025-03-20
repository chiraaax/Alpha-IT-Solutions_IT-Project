import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

const ProductCards = ({ products = [] }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
      {products.map((product) => (
        <div key={product._id} className="product__card__content">
          <div className="relative">
            {/* Eye Icon - Positioned on top of the image */}
            <Link
              to={`/shop/${product._id}`}
              state={{ product }}
              className="absolute top-2 right-2 bg-pink-700 rounded-full p-2 hover:bg-pink-900 transition-colors z-10"
              onClick={() => window.scrollTo(0, 0)} // Scrolls to top when clicked
            >
              <i className="ri-eye-line text-xl text-white" title="View Details"></i>
            </Link>

            {/* Product Image - Ensure it does not overlap the icon */}
            <Link to={`/shop/${product._id}`} state={{ product }} className="relative block">
              <img
                src={product.image}
                alt={product.name}
                className="max-h-96 md:h-64 w-full object-cover transition-transform duration-300 hover:scale-105 p-3"
                onClick={() => window.scrollTo(0, 0)} // Scrolls to top when clicked
              />
            </Link>
          </div>
          
          {/* Product Details */}
          <div>
            <h4>{product.name}</h4>
            {product.description && (
              <p className="text-gray-900 text-xl pl-4 font-sans">
                {product.description}
              </p>
            )}
            <p className="text-sm text-gray-600 text-xl pl-5 pt-4">
              <span className="font-bold">LKR {product.discountPrice}</span>{' '}
              <s className="text-red-500">LKR {product.price}</s>
            </p>
          </div>

          {/* Add to Cart Button */}
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
