import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ProductDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
        <p className="text-gray-600 text-xl">No product data available.</p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded transition duration-300 cursor-pointer"
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-5xl mx-auto bg-gray-300 shadow-2xl rounded-lg overflow-hidden border-4 border-gray-500 ">
        <div className="p-4">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 bg-gray-800 hover:bg-gray-700 text-white font-semibold py-2 px-4 rounded transition duration-300 cursor-pointer"
          >
            Back
          </button>
          <div className="flex flex-col md:flex-row">
            <img 
              src={product.image} 
              alt={product.description} 
              className="w-full md:w-1/2 max-h-96 object-cover rounded-md"
            />
            <div className="md:ml-8 mt-4 md:mt-0 flex flex-col justify-between">
              <div>
                <h1 className="text-3xl font-bold mb-4">{product.description}</h1>
                <p className="text-xl text-gray-800 mb-4">
                  {product.price === product.discountPrice ? (
                    <span className="font-bold">LKR {product.price}</span>
                  ) : (
                    <>
                      <span className="font-bold">LKR {product.discountPrice} </span>
                      <s className="text-red-500">LKR {product.price}</s>
                    </>
                  )}
                </p>
                <p className="mb-2"><strong>Category:</strong> {product.category}</p>
                <p className="mb-2"><strong>Availability:</strong> {product.availability}</p>
                <p className="mb-2"><strong>State:</strong> {product.state}</p>
                <div className="mt-4">
                  <h2 className="text-2xl font-semibold mb-2 underline">Specs:</h2>
                  <ul className="list-disc list-inside">
                    {product.specs?.map((spec, index) => (
                      <li key={index}>{spec.key}: {spec.value}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-6">
                <button 
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded shadow-lg transition duration-300 ease-in-out cursor-pointer"
                  onClick={() => alert('Added to Cart')}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
