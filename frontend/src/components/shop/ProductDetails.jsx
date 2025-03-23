import React, { useState } from 'react';
import { useLocation, useNavigate, useParams  } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiCheckCircle, FiZoomIn, FiX } from 'react-icons/fi';

const ProductDetails = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;

  // State to control modal visibility
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 p-6">
        <p className="text-gray-300 text-xl md:text-2xl font-semibold mb-6">
          No product data available.
        </p>
        <button 
          onClick={() => navigate(-1)}
          className="mt-4 bg-gray-700 hover:bg-gray-600 text-gray-300 font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          <FiArrowLeft className="inline mr-2" />
          Back
        </button>
      </div>
    );
  }

  // Opens the modal with the zoomed image
  const openModal = () => {
    setIsImageModalOpen(true);
  };

  // Closes the modal
  const closeModal = () => {
    setIsImageModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-800 p-6">
      <div className="max-w-3xl mx-auto bg-gray-900 shadow-xl rounded-lg overflow-hidden border-t-4 border-pink-500">
        <div className="p-16">
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 bg-transparent hover:bg-pink-500 text-gray-300 font-semibold py-2 px-4 rounded-full border-2 border-pink-500 hover:text-white transition-all duration-300 ease-in-out"
          >
            <FiArrowLeft className="inline mr-2" />
            Back
          </button>
          <div className="flex flex-col md:flex-row justify-between">
            {/* Image container with hover icon. Click opens zoom modal */}
            <div 
              className="w-full md:w-1/2 overflow-hidden relative group cursor-pointer"
              onClick={openModal}
            >
              <img 
                src={product.image} 
                alt={product.description} 
                className="w-full max-h-100 object-cover rounded-lg shadow-xl transform transition duration-300 ease-in-out group-hover:scale-105"
              />
              <div className="p-15 absolute inset-0 flex justify-center mt-auto opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <FiZoomIn size={48} className="text-white" />
              </div>
            </div>
            <div className="md:ml-8 mt-6 md:mt-0 flex flex-col justify-between text-gray-300">
              <div>
                <h1 className="text-3xl font-bold mb-4 text-white">{product.description}</h1>
                <p className="text-xl font-bold mb-4">
                  {product.price === product.discountPrice ? (
                    <span className="text-yellow-400">LKR {product.price}</span>
                  ) : (
                    <>
                      <span className="text-green-400">LKR {product.discountPrice} </span>
                      <s className="text-red-500">LKR {product.price}</s>
                    </>
                  )}
                </p>
                <p className="text-lg mb-2">
                  <strong>Category:</strong> {product.category}
                </p>
                <p className="text-lg mb-2">
                  <strong>Availability:</strong> {product.availability}
                </p>
                <p className="text-lg mb-4">
                  <strong>State:</strong> {product.state}
                </p>
                
                <div className="mt-8">
                  <h2 className="text-2xl font-semibold mb-4 text-white">Specs:</h2>
                  <ul className="space-y-4">
                    {product.specs?.map((spec, index) => (
                      <li 
                        key={index} 
                        className="flex items-center text-lg text-gray-400"
                      >
                        <FiCheckCircle 
                          className="text-pink-500 mr-2 flex-shrink-0" 
                          size={20} 
                        />
                        <span>{spec.key}: {spec.value}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-8">
                <button 
                  onClick={() => alert(`Added ${product.description} (ID: ${productId}) to Cart`)}
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-400 hover:to-purple-400 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <FiShoppingCart className="inline mr-2" />
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal for the zoomed image */}
      {isImageModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
          <div className="relative transform transition-all duration-500 ease-out">
            {/* Close Icon positioned on top-right */}
            <button 
              onClick={closeModal}
              className="absolute top-30 right-30 -translate-y-1 translate-x-1 bg-white bg-opacity-20 backdrop-blur-lg border border-white border-opacity-50 rounded-full p-2 shadow-lg transition-all duration-300 hover:bg-white hover:scale-110"
            >
              <FiX size={24} className="text-black" />
            </button>

              <div className="bg-black rounded-lg overflow-hidden shadow-2xl">
                <img 
                  src={product.image} 
                  alt={product.description} 
                  className="w-full max-h-screen object-contain rounded-lg p-35"
                />
              </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
