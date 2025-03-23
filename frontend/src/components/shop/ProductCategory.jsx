/** 
 * 
 *  Fetches category-specific filters from an API.
    Fetches products based on the selected filters and pagination settings.
    Allows users to filter products by price range and other attributes.
    Implements pagination to navigate through multiple pages of products.
    Handles loading states and errors gracefully
 * 
 */
import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import ProductList from "./ProductList";
import { FiLoader } from "react-icons/fi";

const ProductCategory = () => {
  //get product category from url
  const { category } = useParams();
  const navigate = useNavigate();

  // State for filter configuration fetched from the database
  const [categoryFilters, setCategoryFilters] = useState({});
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [filtersError, setFiltersError] = useState(null);

  // States related to products
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);
  
  // Loader helper state for delayed icon display (1.5 seconds)
  const [showLoader, setShowLoader] = useState(false);

  /*
     Fetch filter configuration from the database based on the category.
  **/ 
  useEffect(() => {
    const fetchCategoryFilters = async () => {
      setLoadingFilters(true);
      setFiltersError(null);
      try {
        const response = await axios.get(
          `http://localhost:5000/api/filters/${category}`
        );
        setCategoryFilters(response.data);
      } catch (err) {
        console.error("❌ Error fetching filter configuration:", err);
        setFiltersError("Failed to load filter options.");
      } finally {
        setLoadingFilters(false);
      }
    };

    fetchCategoryFilters();
  }, [category]);

  // Set a 1.5 seconds delay before showing the loading spinner icon
  // This avoids flickering when products load very quickly.
  useEffect(() => {
    let timer;
    if (loadingProducts) {
      timer = setTimeout(() => {
        setShowLoader(true);
      },99900000099999999999999999999);
    } else {
      setShowLoader(false);
    }
    return () => clearTimeout(timer);
  }, [loadingProducts]);

  // Compute the initial price range from the fetched configuration.
  const initialPriceRange = useMemo(() => {
    return categoryFilters.priceRange
      ? [categoryFilters.priceRange.min, categoryFilters.priceRange.max]
      : [0, 1000];
  }, [categoryFilters.priceRange]);

  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [page, setPage] = useState(1);
  const limit = 12; // 12 products per page
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products based on filters and pagination.
  useEffect(() => {
    const fetchProducts = async () => {
      //Shows a loading spinner to indicate data is being fetched.
      setLoadingProducts(true);
      // Resets any previous error messages.
      setProductsError(null);

      // This section builds the query parameters dynamically for filtering products.
      const params = {
        category,
        page,
        limit,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
        ...Object.fromEntries(
          Object.entries(selectedFilters).map(([key, value]) => [
            key,
            Array.isArray(value) ? value.join(",") : value,
          ])
        ),
      };

      // Log the serialized parameters for debugging.
      // console.log(
      //   "Serialized Params:",
      //   qs.stringify(params, { arrayFormat: "repeat" })
      // );
      // console.log("Final API Request Params:", params);

      try {
        // Make the API request to fetch products.
        const response = await axios.get(`http://localhost:5000/api/products`, {
          params,
          paramsSerializer: (params) =>
            qs.stringify(params, { arrayFormat: "repeat" }),
        });

        console.log("API Response:", response.data);
        setProducts(response.data);

        // Calculate the total number of pages based on the total count of products.
        const totalCountHeader =
        //If the header is available, it extracts and parses the total product count.
        //The backend may send the total number of products in a custom header (X-Total-Count).
          response.headers["x-total-count"] || response.headers["X-Total-Count"];
        const totalCount = totalCountHeader
          ? parseInt(totalCountHeader, 10)
          : response.data.totalCount;

        if (totalCount && !isNaN(totalCount)) {
          setTotalPages(Math.ceil(totalCount / limit));
        }
      } catch (err) {
        console.error("❌ Error fetching products:", err);
        setProductsError("Failed to fetch products. Please try again later.");
      } finally {
        setLoadingProducts(false);
      }
    };

    // Only fetch products if filter configuration is loaded.
    if (!loadingFilters) {
      fetchProducts();
    }
  }, [category, page, priceRange, selectedFilters, loadingFilters]);



  // Reset filters and price range when the category changes.
  useEffect(() => {
    setPriceRange(initialPriceRange);
    setSelectedFilters({});
    setPage(1);
  }, [category, initialPriceRange]);

  // Reset page to 1 whenever the filters change.
  useEffect(() => {
    setPage(1);
  }, [priceRange, selectedFilters]);

  // Scroll to the top whenever the filters change.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [selectedFilters, priceRange]);

  // For radio inputs: deselect if already chosen.
  const handleRadioClick = (filterKey, option) => {
    if (selectedFilters[filterKey] === option) {
      setSelectedFilters((prev) => ({ ...prev, [filterKey]: undefined }));
    } else {
      setSelectedFilters((prev) => ({ ...prev, [filterKey]: option }));
    }
  };

  // Clear all filters (reset selected filters, price range, and page).
  const clearFilters = () => {
    setSelectedFilters({});
    setPriceRange(initialPriceRange);
    setPage(1);
  };

  return (
    <div className="bg-gray-900 pb-6 min-h-screen">
      <section className="container mx-auto py-8 px-4">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-blue-600 transition cursor-pointer"
          >
            &larr; Back
          </button>
        </div>

        <h2 className="text-4xl font-bold text-blue-500 capitalize mb-6">
          {category}
        </h2>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="md:w-1/4 bg-gray-800 p-4 rounded-lg">
            {loadingFilters && (
              <p className="text-white">Loading filter options...</p>
            )}
            {filtersError && <p className="text-red-500">{filtersError}</p>}
            {!loadingFilters && !filtersError && categoryFilters.priceRange && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-white mb-2">
                  Price Range
                </h4>
                <div className="flex items-center space-x-2">
                  <span className="text-white">{priceRange[0]} LKR</span>
                  <input
                    type="range"
                    min={categoryFilters.priceRange.min}
                    max={categoryFilters.priceRange.max}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], Number(e.target.value)])
                    }
                    className="w-full h-2 bg-gray-600 rounded-lg cursor-pointer accent-blue-500"
                  />
                  <span className="text-white">
                    Up to {priceRange[1]} LKR
                  </span>
                </div>
              </div>
            )}

            {/* Clear All Filters Button */}
            <div className="mt-6">
              <button
                onClick={clearFilters}
                className="w-full px-4 py-2 bg-gray-500 text-white font-semibold rounded hover:bg-blue-600 transition cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>

            <div className="space-y-4 mt-6">
              {/* Render top-level filters (like availability, state) */}
              {!loadingFilters &&
                !filtersError &&
                Object.keys(categoryFilters)
                  .filter((key) =>
                    !["priceRange", "_id", "category", "createdAt", "updatedAt", "__v", "options"].includes(key)
                  )
                  .map((filterKey) => {
                    const options = categoryFilters[filterKey];
                    // Ensure options is an array before mapping
                    if (!Array.isArray(options)) return null;
                    return (
                      <div key={filterKey} className="bg-gray-700 p-3 rounded-lg">
                        <h4 className="text-lg font-semibold text-white mb-2">
                          {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
                        </h4>
                        <div className="space-y-2">
                          {options.map((option) => (
                            <label
                              key={option}
                              className="flex items-center gap-2 text-white cursor-pointer"
                            >
                              <input
                                type="radio"
                                name={filterKey}
                                value={option}
                                checked={selectedFilters[filterKey] === option}
                                onClick={() => handleRadioClick(filterKey, option)}
                                className="cursor-pointer accent-blue-500"
                              />
                              {option}
                            </label>
                          ))}
                        </div>
                      </div>
                    );
                  })}

              {/* Render filters inside the "options" object */}
              {!loadingFilters &&
                !filtersError &&
                categoryFilters.options &&
                //  Map over the options object and render each filter group
                Object.keys(categoryFilters.options).map((filterKey) => {
                  // Extract the options array from the options object
                  const options = categoryFilters.options[filterKey];
                  if (!Array.isArray(options)) return null;
                  return (
                    // Render each filter group as a separate section
                    <div key={filterKey} className="bg-gray-700 p-3 rounded-lg">
                      <h4 className="text-lg font-semibold text-white mb-2">
                        {filterKey.charAt(0).toUpperCase() + filterKey.slice(1)}
                      </h4>
                      <div className="space-y-2">
                        {options.map((option) => (
                          <label
                            key={option}
                            className="flex items-center gap-2 text-white cursor-pointer"
                          >
                            <input
                              type="radio"
                              name={filterKey}
                              value={option}
                              checked={selectedFilters[filterKey] === option}
                              onClick={() => handleRadioClick(filterKey, option)}
                              className="cursor-pointer accent-blue-500"
                            />
                            {option}
                          </label>
                        ))}
                      </div>
                    </div>
                  );
                })}
            </div>
          </aside>

          {/* Product Cards Section */}
          <div className="md:w-3/4">
            {loadingProducts && showLoader && (
            <div className="flex justify-center items-center py-4">
              <FiLoader className="text-white animate-spin text-3xl" />
            </div>
          )}
          
            {productsError && (
              <p className="text-red-500">{productsError}</p>
            )}
            {!loadingProducts &&
              !productsError &&
              products.length === 0 && (
                <p className="text-white">
                  Sorry! This product is not yet available.
                </p>
              )}
            {!loadingProducts && !productsError && (
              <ProductList products={products} />
            )}

            {/* Pagination Controls */}
            <div className="flex justify-center mt-6">
              <button
                className="px-4 py-2 mx-2 bg-gray-700 text-white rounded"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <span className="text-white px-4 py-2">Page {page}</span>
              <button
                className="px-4 py-2 mx-2 bg-gray-700 text-white rounded"
                disabled={products.length < limit}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductCategory;
