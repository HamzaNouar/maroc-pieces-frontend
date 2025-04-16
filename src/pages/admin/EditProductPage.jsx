// src/pages/admin/EditProductPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductForm from "../../components/admin/ProductForm";
import {
  fetchProductById,
  updateProduct,
} from "../../store/slices/productSlice";
import { fetchCategories } from "../../store/slices/categorySlice";

const EditProductPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  const { selectedProduct, isLoading, error } = useSelector(
    (state) => state.products
  );
  // const { categories } = useSelector((state) => state.categories);

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(parseInt(id)));
      dispatch(fetchCategories());
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // const handleSubmit = async (formData) => {
  //   try {
  //     formData.append("id", id);
  //     await dispatch(updateProduct(formData)).unwrap();
  //     toast.success("Produit mis à jour avec succès");
  //     navigate("/admin/products");
  //   } catch (error) {
  //     toast.error("Erreur lors de la mise à jour du produit");
  //   }
  // };

  if (isLoading && !selectedProduct) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2">Chargement du produit...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!selectedProduct && !isLoading) {
    return (
      <AdminLayout>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Produit non trouvé.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Modifier le produit</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ProductForm product={selectedProduct} />
      </div>
    </AdminLayout>
  );
};

export default EditProductPage;
