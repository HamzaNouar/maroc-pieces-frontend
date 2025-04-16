// src/components/products/FilterSidebar.jsx
import React, { useState } from "react";

const FilterSidebar = ({ categories, onFilter, initialFilters }) => {
  const [filters, setFilters] = useState(
    initialFilters || {
      minPrice: "",
      maxPrice: "",
      categoryId: "",
      inStock: false,
    }
  );

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFilters({
      ...filters,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleReset = () => {
    const resetFilters = {
      minPrice: "",
      maxPrice: "",
      categoryId: "",
      inStock: false,
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Filtres</h2>

      <form onSubmit={handleSubmit}>
        {/* Price Range */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Prix (DH)</h3>
          <div className="flex space-x-2">
            <div className="flex-1">
              <label htmlFor="minPrice" className="sr-only">
                Prix minimum
              </label>
              <input
                type="number"
                id="minPrice"
                name="minPrice"
                placeholder="Min"
                className="w-full p-2 border border-gray-300 rounded"
                value={filters.minPrice}
                onChange={handleChange}
                min="0"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="maxPrice" className="sr-only">
                Prix maximum
              </label>
              <input
                type="number"
                id="maxPrice"
                name="maxPrice"
                placeholder="Max"
                className="w-full p-2 border border-gray-300 rounded"
                value={filters.maxPrice}
                onChange={handleChange}
                min="0"
              />
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <h3 className="font-medium mb-2">Catégories</h3>
          <select
            name="categoryId"
            className="w-full p-2 border border-gray-300 rounded"
            value={filters.categoryId}
            onChange={handleChange}
          >
            <option value="">Toutes les catégories</option>
            {categories?.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Stock Status */}
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="inStock"
              checked={filters.inStock}
              onChange={handleChange}
              className="mr-2"
            />
            <span>Produits en stock uniquement</span>
          </label>
        </div>

        {/* Filter Buttons */}
        <div className="flex space-x-2">
          <button
            type="submit"
            className="flex-1 bg-primary text-white py-2 rounded hover:bg-primary-dark"
          >
            Appliquer
          </button>
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 bg-gray-200 text-gray-800 py-2 rounded hover:bg-gray-300"
          >
            Réinitialiser
          </button>
        </div>
      </form>
    </div>
  );
};

export default FilterSidebar;
