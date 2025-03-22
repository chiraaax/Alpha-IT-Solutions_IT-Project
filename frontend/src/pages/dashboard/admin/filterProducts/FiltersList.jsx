import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const FiltersList = () => {
  const [filters, setFilters] = useState([]);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [formData, setFormData] = useState({});
  // This state holds the options as an array of objects for easy editing.
  const [optionsList, setOptionsList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchFilters();
  }, []);

  const fetchFilters = () => {
    axios.get('http://localhost:5000/api/filters')
      .then(response => setFilters(response.data))
      .catch(err => console.error(err));
  };

  // Open the edit modal and initialize form data and optionsList
  const openEditModal = (filter) => {
    setSelectedFilter(filter);
    setFormData({
      category: filter.category,
      priceRange: filter.priceRange,
      availability: filter.availability,
      state: filter.state,
      // We no longer use the textarea for options.
      // options will be built from optionsList during submit.
    });
    // Convert filter.options (an object) to an array for dynamic editing.
    if (filter.options) {
      const list = Object.entries(filter.options).map(([key, values]) => ({
        key,
        values: values.join(', ')
      }));
      setOptionsList(list);
    } else {
      setOptionsList([]);
    }
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedFilter(null);
    setOptionsList([]);
  };

  // Open the delete modal for confirmation
  const openDeleteModal = (filter) => {
    setSelectedFilter(filter);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedFilter(null);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/filters/${selectedFilter._id}`);
      setFilters(filters.filter(filter => filter._id !== selectedFilter._id));
      closeDeleteModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Convert optionsList array into an object where each key maps to an array of values.
      const optionsObject = {};
      optionsList.forEach(option => {
        const key = option.key.trim();
        if (key) {
          // Split comma-separated values and filter out any empty strings.
          optionsObject[key] = option.values.split(',')
            .map(item => item.trim())
            .filter(item => item);
        }
      });
      const updatedData = {
        ...formData,
        options: optionsObject
      };
      const response = await axios.put(`http://localhost:5000/api/filters/${selectedFilter._id}`, updatedData);
      const updatedFilter = response.data;
      setFilters(filters.map(filter => filter._id === updatedFilter._id ? updatedFilter : filter));
      closeEditModal();
    } catch (err) {
      console.error(err);
    }
  };

  // Handlers for simple text changes in the main form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handlers for dynamic options list
  const handleOptionChange = (index, field, value) => {
    const newOptionsList = [...optionsList];
    newOptionsList[index][field] = value;
    setOptionsList(newOptionsList);
  };

  const addOption = () => {
    setOptionsList([...optionsList, { key: '', values: '' }]);
  };

  const removeOption = (index) => {
    const newOptionsList = optionsList.filter((_, i) => i !== index);
    setOptionsList(newOptionsList);
  };

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-100">
        Filter Configurations
      </h1>
      <div className="space-y-6">
        {filters.map(filter => (
          <div key={filter._id} className="bg-gray-800 p-6 rounded shadow-md">
            <h3 className="text-2xl font-semibold mb-2 text-gray-100">
              {filter.category}
            </h3>
            <p className="text-gray-300 mb-1">
              Price Range: {filter.priceRange.min} - {filter.priceRange.max}
            </p>
            <p className="text-gray-300 mb-1">
              Availability: {filter.availability.join(', ')}
            </p>
            <p className="text-gray-300 mb-3">
              State: {filter.state.join(', ')}
            </p>
            {filter.options && (
              <div className="mb-4">
                {Object.entries(filter.options).map(([key, values]) => (
                  <div key={key} className="text-gray-300">
                    <span className="font-semibold">{key}:</span> {values.join(', ')}
                  </div>
                ))}
              </div>
            )}
            <div className="flex space-x-4">
              <button 
                onClick={() => openEditModal(filter)}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                Edit
              </button>
              <button 
                onClick={() => openDeleteModal(filter)}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 text-center">
        <button 
          onClick={() => navigate('/add')}
          className="px-6 py-3 bg-green-500 text-white font-bold rounded hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
        >
          Add New Filter
        </button>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeEditModal}></div>
          <div className="bg-gray-800 p-6 rounded shadow-md z-10 w-96 overflow-y-auto max-h-full">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Edit Filter</h2>
            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-300">Category</label>
                <input
                  type="text"
                  name="category"
                  value={formData.category || ''}
                  onChange={handleChange}
                  className="w-full p-2 rounded bg-gray-700 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-300">Price Range</label>
                <div className="flex space-x-2">
                  <input
                    type="number"
                    name="priceMin"
                    value={formData.priceRange?.min || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      priceRange: { ...formData.priceRange, min: Number(e.target.value) }
                    })}
                    placeholder="Min"
                    className="w-1/2 p-2 rounded bg-gray-700 text-gray-100"
                  />
                  <input
                    type="number"
                    name="priceMax"
                    value={formData.priceRange?.max || ''}
                    onChange={(e) => setFormData({
                      ...formData,
                      priceRange: { ...formData.priceRange, max: Number(e.target.value) }
                    })}
                    placeholder="Max"
                    className="w-1/2 p-2 rounded bg-gray-700 text-gray-100"
                  />
                </div>
              </div>
              <div>
                <label className="block text-gray-300">Availability (comma separated)</label>
                <input
                  type="text"
                  name="availability"
                  value={formData.availability ? formData.availability.join(', ') : ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    availability: e.target.value.split(',').map(item => item.trim())
                  })}
                  className="w-full p-2 rounded bg-gray-700 text-gray-100"
                />
              </div>
              <div>
                <label className="block text-gray-300">State (comma separated)</label>
                <input
                  type="text"
                  name="state"
                  value={formData.state ? formData.state.join(', ') : ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    state: e.target.value.split(',').map(item => item.trim())
                  })}
                  className="w-full p-2 rounded bg-gray-700 text-gray-100"
                />
              </div>
              {/* Dynamic Options Editor */}
              <div>
                <label className="block text-gray-300 mb-2">Options</label>
                {optionsList.map((option, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder="Key"
                      value={option.key}
                      onChange={(e) => handleOptionChange(index, 'key', e.target.value)}
                      className="w-1/3 p-2 rounded bg-gray-700 text-gray-100"
                    />
                    <input
                      type="text"
                      placeholder="Comma separated values"
                      value={option.values}
                      onChange={(e) => handleOptionChange(index, 'values', e.target.value)}
                      className="w-1/2 p-2 rounded bg-gray-700 text-gray-100"
                    />
                    <button 
                      type="button" 
                      onClick={() => removeOption(index)}
                      className="px-2 py-1 bg-red-500 text-white rounded"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  onClick={addOption}
                  className="px-4 py-2 bg-green-500 text-white rounded"
                >
                  Add Option
                </button>
              </div>
              <div className="flex justify-end space-x-4">
                <button 
                  type="button" 
                  onClick={closeEditModal} 
                  className="px-4 py-2 bg-gray-600 text-white rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 bg-blue-500 text-white rounded"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-black opacity-50" onClick={closeDeleteModal}></div>
          <div className="bg-gray-800 p-6 rounded shadow-md z-10 w-96">
            <h2 className="text-xl font-bold text-gray-100 mb-4">Confirm Delete</h2>
            <p className="text-gray-300 mb-4">
              Are you sure you want to delete the filter for <strong>{selectedFilter?.category}</strong>?
            </p>
            <div className="flex justify-end space-x-4">
              <button 
                onClick={closeDeleteModal} 
                className="px-4 py-2 bg-gray-600 text-white rounded"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default FiltersList;
