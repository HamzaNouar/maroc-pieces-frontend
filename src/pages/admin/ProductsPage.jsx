// src/pages/admin/ProductsPage.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Edit, Trash2, Plus, Search } from "lucide-react";
import { toast } from "react-toastify";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  fetchProducts,
  deleteProduct,
  searchProducts,
  setCurrentPage,
} from "../../store/slices/productSlice";
import Pagination from "../../components/common/Pagination";

const ProductsPage = () => {
  const dispatch = useDispatch();
  const { products, isLoading, error, pagination, adminActionSuccess } =
    useSelector((state) => state.products);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const pageSize = 5; // Number of items per page

  // Initial data load
  useEffect(() => {
    dispatch(fetchProducts({ page: pagination.currentPage, pageSize }));
  }, [dispatch, adminActionSuccess]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle search with debounce
  useEffect(() => {
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      if (searchTerm.trim()) {
        dispatch(searchProducts({ query: searchTerm, page: 1, pageSize }));
      } else {
        dispatch(fetchProducts({ page: 1, pageSize }));
      }
      // Reset to page 1 when searching
      dispatch(setCurrentPage(1));
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTerm, dispatch]);

  const handleDelete = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit?")) {
      try {
        await dispatch(deleteProduct({ productId: id })).unwrap();
        toast.success("Produit supprimé avec succès");

        // Reload current page, or go to previous page if this was the last item on the page
        if (products.length === 1 && pagination.currentPage > 1) {
          dispatch(setCurrentPage(pagination.currentPage - 1));
          dispatch(
            fetchProducts({ page: pagination.currentPage - 1, pageSize })
          );
        } else {
          dispatch(fetchProducts({ page: pagination.currentPage, pageSize }));
        }
      } catch (error) {
        toast.error("Erreur lors de la suppression du produit");
      }
    }
  };

  const handlePageChange = (newPage) => {
    dispatch(setCurrentPage(newPage));
    if (searchTerm.trim()) {
      dispatch(searchProducts({ query: searchTerm, page: newPage, pageSize }));
    } else {
      dispatch(fetchProducts({ page: newPage, pageSize }));
    }
  };

  return (
    <AdminLayout>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestion des produits</h1>
        <Link
          to="/admin/products/new"
          className="bg-primary text-white px-4 py-2 rounded-md flex items-center"
        >
          <Plus className="h-5 w-5 mr-1" />
          Ajouter un produit
        </Link>
      </div>

      {/* Search and filters */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex items-center">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Products table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="p-4 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
            <p className="mt-2">Chargement des produits...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="p-4 text-center">
            <p>Aucun produit trouvé.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Image
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Nom
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      SKU
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Catégorie
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Prix
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="h-10 w-10 bg-gray-200 rounded">
                          {product.imageUrl ? (
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_IMG ||
                                "https://localhost:7263"
                              }${product.imageUrl}`}
                              alt={product.name}
                              className="h-10 w-10 object-cover rounded"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-gray-500">
                              N/A
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {product.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {product.sku || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {product.categoryName || "N/A"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.price.toFixed(2)} DH
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {product.stockQuantity}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <Link
                            to={`/admin/products/edit/${product.id}`}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <Edit className="h-5 w-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
              <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage de{" "}
                      <span className="font-medium">
                        {(pagination.currentPage - 1) * pageSize + 1}
                      </span>{" "}
                      à{" "}
                      <span className="font-medium">
                        {Math.min(
                          pagination.currentPage * pageSize,
                          pagination.totalItems
                        )}
                      </span>{" "}
                      sur{" "}
                      <span className="font-medium">
                        {pagination.totalItems}
                      </span>{" "}
                      résultats
                    </p>
                  </div>
                  <div>
                    <Pagination
                      currentPage={pagination.currentPage}
                      totalPages={pagination.totalPages}
                      onPageChange={handlePageChange}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductsPage;
