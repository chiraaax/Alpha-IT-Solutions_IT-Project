//filtering page for shop
import React from 'react';

const ShopFiltering = ({ filter, filtersState, setFiltersState, clearFilters }) => {
    return (
        <div className="space-y-5 flex-shrink-0">
            <h3>Filters</h3>

            {/* Category Filter */}
            <div>
                <h4 className="font-medium text-lg pb-2">Category</h4>
                <hr className='pb-2'/>
                {filter.categories.map((category) => (
                    <label key={category} className="capitalize cursor-pointer block">
                        <input
                            type="radio"
                            name="category"
                            id = 'category'
                            value={category}
                            checked={filtersState.category === category}
                            onChange={(e) => setFiltersState({ ...filtersState, category: e.target.value })}
                        />
                        <span className="ml-2">{category}</span>
                    </label>
                ))}
            </div>

            {/* Color Filter */}
            <div>
                <h4 className="font-medium text-lg pb-2">Color</h4>
                <hr className='p-2'/>
                {filter.colors.map((color) => (
                    <label key={color} className="capitalize cursor-pointer block">
                        <input
                            type="radio"
                            name="color"
                            value={color}
                            checked={filtersState.color === color}
                            onChange={(e) => setFiltersState({ ...filtersState, color: e.target.value })}
                        />
                        <span className="ml-2">{color}</span>
                    </label>
                ))}
            </div>

            {/* Price Range Filter */}
            <div>
                <h4 className="font-medium text-lg pb-2">Price Range</h4>
                <hr className='pb-2'/>
                {filter.priceRanges.map((range, index) => (
                    <label key={index} className="capitalize cursor-pointer block">
                        <input
                            type="radio"
                            name="priceRange"
                            value={`${range.min}-${range.max}`}
                            checked={filtersState.priceRange === `${range.min}-${range.max}`}
                            onChange={(e) => setFiltersState({ ...filtersState, priceRange: e.target.value })}
                        />
                        <span className="ml-2">{range.label}</span>
                    </label>
                ))}
            </div>

            {/* Clear Filters */}
            <button
                className="bg-red-500 text-white px-4 py-2 rounded mt-4"
                onClick={clearFilters}
            >
                Clear Filters
            </button>
        </div>
    );
};

export default ShopFiltering;
