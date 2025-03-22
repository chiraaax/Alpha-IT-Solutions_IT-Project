import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import qs from "qs";
import ProductList from "./ProductList";
import React, { useState, useEffect , useMemo} from 'react';
import { useParams } from 'react-router-dom';
import ProductCards from './ProductCards';
import products from '../../data/products.json';

// Define a configuration object for each category’s filters.
const filtersConfig = {
  laptop: {
    priceRange: { min: 0, max: 2790000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    brand: ['msi', 'asus', 'lenovo', 'hp', 'acer'],
    cpu: [
      'intel core i7',
      'amd ryzen 9',
      'intel core i5',
      'intel core 5 14th gen',
      'intel core i3',
      'amd ryzen 7',
      'snapdragon x plus x1p',
      'intel core i9',
      'intel ultra 9',
      'intel ultra 7',
      'amd ryzen 5',
      'intel ultra 5',
      'intel core 3 14th gen',
      'intel core 7 14th gen',
      'intel n100 / celeron',
      'snapdragon x elite x1e'
    ],
    graphics: [
      'rtx 4050 6gb',
      'amd radeon graphics',
      'rtx 3050 4gb',
      'intel graphics',
      'qualcomm adreno gpu',
      'rtx 4060 8gb',
      'rtx 4070',
      'rtx 3050 6gb',
      'intel arc graphics',
      'rtx 4070 8gb',
      'rtx 2050 4gbr',
      'tx 5080 16g',
      'brtx 4090 16gb'
    ],
    screenSize: ['15 inches', '14 inches', '16 inches', '17 inches', '18 inches']
  },
  motherboards: {
    priceRange: { min: 0, max: 2990000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    chipset: [
      'amd a520',
      'amd b550',
      'amd b450',
      'amd x670',
      'amd b650',
      'intel z790',
      'intel b760',
      'intel h610',
      'intel h510',
      'amd a620',
      'intel z890',
      'amd x870',
      'intel b860',
      'amd b840',
      'amd b850'
    ],
    manufacturer: ['asus', 'msi', 'colorful'],
    socketType: [
      'amd am5',
      'intel 1700 12th/13th/14th gen',
      'amd am4',
      'intel 1200 10th/11th gen',
      'intel lga1851 15th gen'
    ]
  },
  processor: {
    priceRange: { min: 0, max: 2320000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    cpuManufacture: ['amd', 'intel'],
    numberOfCores: [
      '16 cores',
      '24 cores',
      '20 cores',
      '14 cores',
      '8 cores',
      '6 cores',
      '4 cores',
      '10 cores',
      '12 cores'
    ],
    socketType: [
      'amd am5',
      'intel 1700 12th/13th/14th gen',
      'amd am4',
      'intel 1200 10th/11th gen',
      'intel lga1851 15th gen'
    ]
  },
  // RAM category (for memory) example:
  ram: {
    priceRange: { min: 0, max: 108000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    brand: ['corsair', 'team', 'g skill', 'adata', 'transcend'],
    capacity: [
      '64gb (32gb x 2)',
      '32gb (16gb x 2)',
      '16gb (16gb x 1)',
      '32gb (32gb x 1)',
      '8gb (8gb x 1)',
      '48gb (24gb x 2)'
    ],
    speed: [
      'ddr5 6000mhz',
      'ddr5 6400mhz',
      'ddr5 5600mhz',
      'ddr4 3200mhz',
      'laptop ddr5 5600mhz',
      'laptop ddr4 3200mhz',
      'ddr4 3600mhz',
      'ddr5-5200mhz'
    ]
  },
  // GPU category (note: the label in your text was RAM, but the filters pertain to GPUs)
  gpu: {
    priceRange: { min: 0, max: 999000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    chipset: [
      'rtx 4060',
      'rtx 4060ti',
      'rtx 4070 super',
      'rtx 3050',
      'rtx 5070',
      'rtx 5080',
      'rtx 3060',
      't1000',
      't400',
      'rtx 5070ti',
      'gpu holder',
      'rtx 4090',
      'gtx 1650',
      'rtx 5090',
      'rtx 4080 super',
      'gt730',
      'gt 1030',
      'rtx 2000',
      'amd rx7600',
      'rtx a400',
      'gt 710',
      'riser cable'
    ],
    manufacturer: ['asus', 'msi', 'nvidia', 'zotac', 'corsair'],
    vram: ['8gb', '12gb', '16gb', '4gb', '24gb', '32gb', '6gb', '2gb']
  },
  // Power supplies (again the label in your text was RAM, but these filters are for power supplies)
  powerSupply: {
    priceRange: { min: 0, max: 245000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    brands: ['asus', 'corsair', 'antec', 'thermal take', 'prolink', 'seasonic'],
    modularType: ['full modular', 'non modular', 'semi modular'],
    powerEfficiency: ['80+ titanium', '80+ gold', '80+ platinum', '80+ bronze', 'non rated'],
    type: ['power supply', 'ups'],
    wattage: ['1600w', '1200w', '850w', '750w', '1000w', '650w', '550w', '450w']
  },
  casings: {
    priceRange: { min: 0, max: 165000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    manufacturer: ['asus', 'lian li', 'antec', 'corsair gamdias', 'gfield', 'msi', 'gigabyte', 'cooler master', 'nzxt', 'alcatroz', 'viper'],
    chassisColor: ['black', 'white', 'black & white'],
    motherboardSupportSize: ['e-atx', 'mini-itx', 'atx', 'm-atx', 'itx', 'micro-atx']
  },
  monitors: {
    priceRange: { min: 0, max: 782000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    manufacturer: ['msi', 'asus', 'corsair', 'lenovo', 'acer', 'viewsonic', 'hp', 'lg', 'dell'],
    monitorType: ['gaming monitor', 'personal monitor', 'professional monitor'],
    panelType: ['oled', 'va', 'ips', 'tn'],
    recommendedResolution: [
      '5120 x 1440',
      '2560 x 1440',
      '3440 x 1440',
      '1920 x 1080',
      '3840 x 2160',
      '1366 x 768',
      '2560 x 1080',
      '3840 x 1080',
      '2560 x 2880'
    ],
    refreshRate: [
      '144hz',
      '360hz',
      '175hz',
      '170hz',
      '180hz',
      '100hz',
      '250hz',
      '240hz',
      '60hz',
      '75hz',
      '165hz',
      '120hz',
      '160hz',
      '220hz',
      '155hz',
      '200hz'
    ],
    screenSize: [
      '49 inch',
      '27 inch',
      '34 inch',
      '32 inch',
      '24 inch',
      '45 inch',
      '25 inch',
      '19 inch',
      '22 inch',
      '15 inch',
      '30 inch',
      '39 inch',
      '28 inch',
      '40 inch',
      '20 inch'
    ]
  },
  'cpu coolers': {
    priceRange: { min: 0, max: 159500 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    coolerManufacturer: [
      'gamdias',
      'corsair',
      'antec',
      'asus',
      'cooler master',
      'lian li',
      'msi',
      'noctua',
      'nzxt',
      'adata',
      'thermal grizzly',
      'silvers tone',
      'acegeek'
    ]
  },
  keyboard: {
    priceRange: { min: 0, max: 145000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    connectivity: ['wireless', 'wired'],
    manufacturer: [
      'asus',
      'corsair',
      'fantech',
      'gamdias',
      'hyperx',
      'logitech',
      'prolink',
      'mi',
      'msi',
      'galax',
      'lenovo',
      'adata',
      'hp'
    ],
    mechanical: ['yes', 'no']
  },
  mouse: {
    priceRange: { min: 0, max: 145000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    connectivity: ['wireless', 'wired'],
    manufacturer: [
      'asus',
      'corsair',
      'fantech',
      'gamdias',
      'hyperx',
      'logitech',
      'prolink',
      'mi',
      'msi',
      'galax',
      'lenovo',
      'adata',
      'hp'
    ],
    mechanical: ['yes', 'no']
  },
  'sound systems': {
    priceRange: { min: 0, max: 132500 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    soundConnectivity: ['wired', 'wireless'],
    soundManufacturer: [
      'corsair',
      'soundpeats',
      'asus',
      'fantech',
      'hyperx',
      'logitech',
      'nzxt',
      'razer',
      'sonicgear',
      'noise',
      'patriot',
      'msi',
      'microlab',
      'sennheiser',
      'anker ugreen'
    ],
    soundType: ['headset', 'buds', 'speakers', 'headset']
  },
  'cables and connectors': {
    priceRange: { min: 0, max: 15000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    cableLength: ['2m', '1.5m', '1m', '3m', '0.8m'],
    productType: [
      'dp/hdmi',
      'hub/converters',
      'tools',
      'router',
      'bluetooth',
      'gaming router',
      'mobile router',
      'wifi / wlan',
      'type c (thunderbolt)',
      'surge protector',
      'cable converters',
      'network cable (ethernet)'
    ]
  },
  storage: {
    priceRange: { min: 0, max: 276000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    storageCapacity: [
      '2tb',
      '1tb',
      '2 nas drive bays',
      '4 nas drive bays',
      '512gb',
      '6 nas drive bays',
      '500gb',
      '256gb',
      '4tb',
      '6tb',
      '8tb',
      '10tb'
    ],
    storageManufacturer: [
      'samsung',
      'asustor',
      'team',
      'addlink',
      'seagate',
      'western digital',
      'toshiba',
      'lexar',
      'corsair',
      'kingston'
    ],
    storageType: [
      'ssd m.2',
      'nas device',
      'ssd sata',
      'desktop hard disk',
      'laptop hard disk',
      'nas drive'
    ]
  },
  'external storage': {
    priceRange: { min: 0, max: 138000 },
    availability: ['out of stock', 'in stock', 'pre-order'],
    externalStorageBrand: [
      'western digital',
      'corsair',
      'team',
      'sandisk',
      'samsung',
      'transcend',
      'asus adata',
      'ugreen'
    ],
    externalStorageCapacity: [
      '1tb',
      '2tb',
      '4tb',
      '5tb',
      '6tb',
      '500gb',
      '64gb',
      '128gb',
      '256gb'
    ],
    externalStorageType: [
      'portable hard disk',
      'portable ssd',
      'pendrive',
      'external hdd case',
      '2.5 sata enclosure'
    ]
  }
};

const ProductCategory = () => {
  const { category } = useParams();
  const navigate = useNavigate();

  // State for filter configuration fetched from the database
  const [categoryFilters, setCategoryFilters] = useState({});
  const [loadingFilters, setLoadingFilters] = useState(false);
  const [filtersError, setFiltersError] = useState(null);

  // Fetch filter configuration from the database based on the category.
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

  // Compute the initial price range from the fetched configuration.
  const initialPriceRange = useMemo(() => {
    return categoryFilters.priceRange
      ? [categoryFilters.priceRange.min, categoryFilters.priceRange.max]
      : [0, 1000];
  }, [categoryFilters.priceRange]);

  const [priceRange, setPriceRange] = useState(initialPriceRange);
  const [selectedFilters, setSelectedFilters] = useState({});
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [productsError, setProductsError] = useState(null);

  const [page, setPage] = useState(1);
  const limit = 12; // 12 products per page
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products based on filters and pagination.
  useEffect(() => {
    const fetchProducts = async () => {
      setLoadingProducts(true);
      setProductsError(null);

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

      console.log("Serialized Params:", qs.stringify(params, { arrayFormat: "repeat" }));
      console.log("Final API Request Params:", params);

      try {
        const response = await axios.get(`http://localhost:5000/api/products`, {
          params,
          paramsSerializer: (params) => qs.stringify(params, { arrayFormat: "repeat" }),
        });

        console.log("API Response:", response.data);
        setProducts(response.data);

        const totalCountHeader =
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

    // Only fetch products if the filter configuration has been loaded.
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

  // Scroll to top whenever filters change.
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
                Object.keys(categoryFilters.options).map((filterKey) => {
                  const options = categoryFilters.options[filterKey];
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
            </div>
          </aside>

          {/* Product Cards Section */}
          <div className="md:w-3/4">
            {loadingProducts && (
              <p className="text-white">Loading products...</p>
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
    const { category } = useParams();
    const categoryFilters = filtersConfig[category] || {};
  
    // Memoize initialPriceRange so its reference doesn't change on every render.
    const initialPriceRange = useMemo(() => {
      return categoryFilters.priceRange
        ? [categoryFilters.priceRange.min, categoryFilters.priceRange.max]
        : [0, 1000];
    }, [categoryFilters.priceRange]);
  
    const [priceRange, setPriceRange] = useState(initialPriceRange);
  
    // For non-price filters, store selected options in an object (each key holds an array)
    const [selectedFilters, setSelectedFilters] = useState({});
  
    // Reset filters when the category changes.
    useEffect(() => {
      setPriceRange(initialPriceRange);
      setSelectedFilters({});
    }, [category, initialPriceRange]);
  
    // Toggle filter option for multiple selections.
    const toggleFilter = (filterKey, option) => {
      setSelectedFilters((prev) => {
        const current = prev[filterKey] || [];
        if (current.includes(option)) {
          // Remove option
          return { ...prev, [filterKey]: current.filter((v) => v !== option) };
        } else {
          // Add option
          return { ...prev, [filterKey]: [...current, option] };
        }
      });
    };
  
    // Filter products based on category, price range, and selected filter options.
    const filteredProducts = products.filter((product) => {
      if (product.category !== category) return false;
      if (product.price < priceRange[0] || product.price > priceRange[1])
        return false;
      for (const filterKey in selectedFilters) {
        const selectedOptions = selectedFilters[filterKey];
        if (selectedOptions && selectedOptions.length > 0) {
          // Ensure product attribute matches at least one selected option.
          if (!selectedOptions.includes(product[filterKey])) return false;
        }
      }
      return true;
    });
  
    return (
      <div className="bg-gray-900 pb-6 min-h-screen">
        <section className="container mx-auto py-8 px-4">
          <h2 className="text-3xl font-bold text-white capitalize mb-6">
            {category} Products
          </h2>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left: Filters Sidebar */}
            <aside className="md:w-1/4 bg-gray-800 p-4 rounded-lg">
              {/* Price Range Filter */}
              {categoryFilters.priceRange && (
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
  
              {/* Other Filters */}
              <div className="space-y-4">
                {Object.keys(categoryFilters).map((filterKey) => {
                  if (filterKey === 'priceRange') return null;
                  const options = categoryFilters[filterKey];
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
                              type="checkbox"
                              name={filterKey}
                              value={option}
                              checked={
                                selectedFilters[filterKey]
                                  ? selectedFilters[filterKey].includes(option)
                                  : false
                              }
                              onChange={() => toggleFilter(filterKey, option)}
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
  
            {/* Right: Product Cards */}
            <div className="md:w-3/4">
              <ProductCards products={filteredProducts} />
            </div>
          </div>
        </section>
      </div>
    );
  };

export default ProductCategory;
