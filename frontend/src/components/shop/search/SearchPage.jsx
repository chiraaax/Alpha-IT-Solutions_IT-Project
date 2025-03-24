import React, { useState, useEffect } from "react";
import ProductCards from "../ProductCards";
import { FiLoader } from "react-icons/fi";

const SearchPage = () => {
  const [products, setProducts] = useState([]);
  const [tags, setTags] = useState({ categories: [] });
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [showLoader, setShowLoader] = useState(false);

  // Fetch products from the database
  useEffect(() => {
    setLoadingProducts(true);
    fetch("http://localhost:5000/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);

        // Extract unique categories
        const categories = Array.from(
          new Set(data.map((product) => product.category))
        );

        // Extract unique specs (as key: value pairs)
        const specs = data
          .map((product) =>
            product.specs?.map((spec) => `${spec.key}: ${spec.value}`) || []
          )
          .flat();
        const uniqueSpecs = Array.from(new Set(specs));

        // Set tags for categories and specs
        setTags({ categories, specs: uniqueSpecs });
      })
      .catch((err) => console.error("Error fetching products:", err))
      .finally(() => {
        setLoadingProducts(false);
      });
  }, []);

  // Delayed loader effect (1.5 seconds)
  useEffect(() => {
    let timer;
    if (loadingProducts) {
      timer = setTimeout(() => {
        setShowLoader(true);
      }, 5435555555555555);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [loadingProducts]);

  // Handle click on a tag
  const handleTagClick = (tag) => {
    setSearchTerm(tag);
  };

  // Filter products based on search term or tags
  const filteredProducts = products.filter((product) => {
    const lowerCaseSearch = searchTerm.toLowerCase();
    return (
      (product.category &&
        product.category.toLowerCase().includes(lowerCaseSearch)) ||
      (product.specs &&
        product.specs.some(
          (spec) =>
            (spec.key && spec.key.toLowerCase().includes(lowerCaseSearch)) ||
            (spec.value && spec.value.toLowerCase().includes(lowerCaseSearch))
        ))
    );
  });

  return (
    <div className="min-h-screen py-12 bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-4 mb-6 bg-gray-700 border border-gray-600 rounded-lg shadow-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />

          {/* Filter Tags */}
          <div className="mb-6">
            <h3 className="font-semibold text-xl text-blue-400 mb-3">Tags:</h3>
            <div className="flex flex-wrap gap-4">
              {tags.categories.map((category, idx) => (
                <span
                  key={idx}
                  onClick={() => handleTagClick(category)}
                  className="bg-blue-600 text-white px-5 py-2 rounded-full cursor-pointer hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Display Loading Spinner or Filtered Products */}
        <div>
          {loadingProducts && showLoader ? (
            <div className="flex justify-center items-center py-4">
              <FiLoader className="text-white animate-spin text-3xl" />
            </div>
          ) : (
            <ProductCards products={filteredProducts} />
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
