import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import {
  fetchProducts,
  searchProducts,
  filterProducts,
  fetchCategories,
  setCurrentPage,
} from "../store/slices/productSlice";
import Layout from "../components/layout/Layout";
import ProductCard from "../components/products/ProductCard";
import FilterSidebar from "../components/products/FilterSidebar";
import SearchBar from "../components/products/SearchBar";
import Pagination from "../components/common/Pagination";
import { ChevronDown } from "lucide-react";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    products,
    categories,
    isLoading,
    error,
    pagination,
    currentFilters,
    currentSearchQuery,
  } = useSelector((state) => state.products);

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Get URL query params
  const queryParams = new URLSearchParams(location.search);
  const categoryId = queryParams.get("categoryId");
  const page = Number.parseInt(queryParams.get("page") || "1", 10);
  const pageSize = Number.parseInt(queryParams.get("pageSize") || "6", 10);

  // Initialize filters with category from URL if present
  const initialFilters = {
    minPrice: "",
    maxPrice: "",
    categoryId: categoryId || "",
    inStock: false,
  };

  useEffect(() => {
    dispatch(fetchCategories());

    // If page is specified in URL, update Redux state
    if (page !== pagination.currentPage) {
      dispatch(setCurrentPage(page));
    }

    // Load products based on current state
    loadProducts();
  }, [dispatch, page, pageSize, categoryId]);

  // Function to load products based on current state
  const loadProducts = () => {
    if (currentSearchQuery) {
      dispatch(
        searchProducts({
          query: currentSearchQuery,
          page,
          pageSize,
        })
      );
    } else if (Object.keys(currentFilters).length > 0) {
      dispatch(
        filterProducts({
          filters: currentFilters,
          page,
          pageSize,
        })
      );
    } else if (categoryId) {
      dispatch(
        filterProducts({
          filters: { categoryId },
          page,
          pageSize,
        })
      );
    } else {
      dispatch(fetchProducts({ page, pageSize }));
    }
  };

  const handleSearch = (query) => {
    if (query.trim()) {
      // Reset to page 1 when searching
      updateUrlAndNavigate(1);
      dispatch(searchProducts({ query, page: 1, pageSize }));
    } else {
      updateUrlAndNavigate(1);
      dispatch(fetchProducts({ page: 1, pageSize }));
    }
  };

  const handleFilter = (filters) => {
    // Remove empty values from filters
    const cleanFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "" && value !== false) {
        acc[key] = value;
      }
      return acc;
    }, {});

    // Reset to page 1 when filtering
    updateUrlAndNavigate(1);

    if (Object.keys(cleanFilters).length > 0) {
      dispatch(filterProducts({ filters: cleanFilters, page: 1, pageSize }));
    } else {
      dispatch(fetchProducts({ page: 1, pageSize }));
    }
  };

  const handlePageChange = (newPage) => {
    updateUrlAndNavigate(newPage);
    // The products will be loaded by the useEffect that watches for page changes
  };

  // Update URL with new page number and navigate
  const updateUrlAndNavigate = (newPage) => {
    const newParams = new URLSearchParams(location.search);
    newParams.set("page", newPage.toString());
    navigate(`${location.pathname}?${newParams.toString()}`);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Nos Produits</h1>

        {/* Search Bar */}
        <div className="mb-6">
          <SearchBar
            onSearch={handleSearch}
            initialValue={currentSearchQuery}
          />
        </div>

        {/* Mobile Filter Toggle */}
        <div className="md:hidden mb-4">
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="w-full bg-gray-200 py-2 px-4 rounded-lg flex items-center justify-between"
          >
            <span>Filtres</span>
            <ChevronDown className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar - Desktop */}
          <div className="hidden md:block md:w-1/4">
            <FilterSidebar
              categories={categories}
              onFilter={handleFilter}
              initialFilters={{ ...initialFilters, ...currentFilters }}
            />
          </div>

          {/* Sidebar - Mobile */}
          {isMobileFilterOpen && (
            <div className="md:hidden mb-4">
              <FilterSidebar
                categories={categories}
                onFilter={handleFilter}
                initialFilters={{ ...initialFilters, ...currentFilters }}
              />
            </div>
          )}

          {/* Products Grid */}
          <div className="md:w-3/4">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                <p className="mt-2">Chargement des produits...</p>
              </div>
            ) : error ? (
              <div className="bg-red-100 text-red-700 p-4 rounded-lg">
                {error}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-lg">Aucun produit trouvé.</p>
              </div>
            ) : (
              <>
                {/* Products count and current page info */}
                <div className="mb-4 text-sm text-gray-600">
                  Affichage de{" "}
                  {(pagination.currentPage - 1) * pagination.pageSize + 1} à{" "}
                  {Math.min(
                    pagination.currentPage * pagination.pageSize,
                    pagination.totalItems
                  )}{" "}
                  sur {pagination.totalItems} produits
                </div>

                {/* Products grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.totalPages > 1 && (
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    onPageChange={handlePageChange}
                    className="mt-8"
                  />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProductsPage;
