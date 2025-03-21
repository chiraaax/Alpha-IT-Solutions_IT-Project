import React, { useState, useEffect } from 'react';
import axios from 'axios';

const filtersConfig = {
    laptop: {
      priceRange: { min: 0, max: 2790000 },
      availability: ['out of stock', 'in stock', 'pre-order'],    
      state : ['new', 'used', 'refurbished'],
      brand: ['msi', 'asus', 'lenovo', 'hp', 'acer'],
      laptopCPU: [
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
      laptopGraphics: [
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
      laptopScreenSize: ['15 inches', '14 inches', '16 inches', '17 inches', '18 inches']
    },
    motherboard: {
      priceRange: { min: 0, max: 2990000 },
      availability: ['out of stock', 'in stock', 'pre-order'],
      state : ['new', 'used', 'refurbished'],
      motherboardChipset: [
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
      motherboardManufacturer: ['asus', 'msi', 'colorful'],
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
      state : ['new', 'used', 'refurbished'],
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
      state : ['new', 'used', 'refurbished'],
      brand: ['corsair', 'team', 'g skill', 'adata', 'transcend'],
      ramCapacity: [
        '64gb (32gb x 2)',
        '32gb (16gb x 2)',
        '16gb (16gb x 1)',
        '32gb (32gb x 1)',
        '8gb (8gb x 1)',
        '48gb (24gb x 2)'
      ],
      ramSpeed: [
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
      state : ['new', 'used', 'refurbished'],
      gpuChipset: [
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
      gpuManufacturer: ['asus', 'msi', 'nvidia', 'zotac', 'corsair'],
      gpuVram: ['8gb', '12gb', '16gb', '4gb', '24gb', '32gb', '6gb', '2gb']
    },
    // Power supplies (again the label in your text was RAM, but these filters are for power supplies)
    powerSupply: {
      priceRange: { min: 0, max: 245000 },
      availability: ['out of stock', 'in stock', 'pre-order'],
      state : ['new', 'used', 'refurbished'],
      brands: ['asus', 'corsair', 'antec', 'thermal take', 'prolink', 'seasonic'],
      modularType: ['full modular', 'non modular', 'semi modular'],
      powerEfficiency: ['80+ titanium', '80+ gold', '80+ platinum', '80+ bronze', 'non rated'],
      supplyType: ['power supply', 'ups'],
      wattage: ['1600w', '1200w', '850w', '750w', '1000w', '650w', '550w', '450w']
    },
    casings: {
      priceRange: { min: 0, max: 165000 },
      availability: ['out of stock', 'in stock', 'pre-order'],
      state : ['new', 'used', 'refurbished'],
      casingsManufacturer: ['asus', 'lian li', 'antec', 'corsair gamdias', 'gfield', 'msi', 'gigabyte', 'cooler master', 'nzxt', 'alcatroz', 'viper'],
      chassisColor: ['black', 'white', 'black & white'],
      motherboardSupportSize: ['e-atx', 'mini-itx', 'atx', 'm-atx', 'itx', 'micro-atx']
    },
    monitors: {
      priceRange: { min: 0, max: 782000 },
      availability: ['out of stock', 'in stock', 'pre-order'],
      state : ['new', 'used', 'refurbished'],
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
    'cpuCoolers': {
      priceRange: { min: 0, max: 159500 },
      availability: ['out of stock', 'in stock', 'pre-order'],
      state : ['new', 'used', 'refurbished'],
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
      state : ['new', 'used', 'refurbished'],
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
      state : ['new', 'used', 'refurbished'],
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
    'soundSystems': {
      priceRange: { min: 0, max: 132500 },
      availability: ['out of stock', 'in stock', 'pre-order'],
      state : ['new', 'used', 'refurbished'],
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
    'cablesConnectors': {
      priceRange: { min: 0, max: 15000 },
      availability: ['out of stock', 'in stock', 'pre-order'],
      state : ['new', 'used', 'refurbished'],
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
      state : ['new', 'used', 'refurbished'],
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
    'externalStorage': {
      priceRange: { min: 0, max: 138000 },
      availability: ['out of stock', 'in stock', 'pre-order'],
      state : ['new', 'used', 'refurbished'],
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
  

  const SearchPage = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredProducts, setFilteredProducts] = useState([]);
  
    // Fetch products from your API endpoint using axios
    useEffect(() => {
      const fetchProducts = async () => {
        try {
          const response = await axios.get("http://localhost:5000/api/products");
          setProducts(response.data);
          setFilteredProducts(response.data);
        } catch (error) {
          console.error("Error fetching products:", error);
        }
      };
      fetchProducts();
    }, []);
  
    // Filter products based on the search term (tags)
    const handleSearch = (e) => {
      const term = e.target.value;
      setSearchTerm(term);
  
      if (term.trim() === '') {
        setFilteredProducts(products);
      } else {
        const lowerTerm = term.toLowerCase();
        const filtered = products.filter((product) => {
          // Assuming product.tags is either an array or string.
          if (product.tags) {
            if (Array.isArray(product.tags)) {
              return product.tags.some((tag) =>
                tag.toLowerCase().includes(lowerTerm)
              );
            } else if (typeof product.tags === 'string') {
              return product.tags.toLowerCase().includes(lowerTerm);
            }
          }
          return false;
        });
        setFilteredProducts(filtered);
      }
    };
  
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        <h1>Product Search</h1>
        <input
          type="text"
          placeholder="Search by tags..."
          value={searchTerm}
          onChange={handleSearch}
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '16px',
            marginBottom: '20px'
          }}
        />
  
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
            gap: '20px'
          }}
        >
          {filteredProducts.length === 0 ? (
            <p>No products found.</p>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {product.image && (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover'
                    }}
                  />
                )}
                <div style={{ padding: '15px' }}>
                  <h3 style={{ margin: '0 0 10px' }}>{product.name}</h3>
                  <p style={{ margin: '0 0 10px', color: '#555' }}>
                    {product.description}
                  </p>
                  <p className="text-sm text-gray-600 text-xl pl-0 pt-4">
              {product.price === product.discountPrice ? (
                <span className="font-bold">LKR {product.price}</span>
              ) : (
                <>
                  <span className="font-bold">LKR {product.discountPrice}</span>{' '}
                  <s className="text-red-500">LKR {product.price}</s>
                </>
              )}
            </p>
                  {product.tags && (
                    <p style={{ marginTop: '10px', color: '#888' }}>
                      Tags:{' '}
                      {Array.isArray(product.tags)
                        ? product.tags.join(', ')
                        : product.tags}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };
  
  export default SearchPage;