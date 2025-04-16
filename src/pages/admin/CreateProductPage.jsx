// src/pages/admin/CreateProductPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import AdminLayout from "../../components/admin/AdminLayout";
import ProductForm from "../../components/admin/ProductForm";
import { fetchCategories } from "../../store/slices/categorySlice";

const CreateProductPage = () => {
  // const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { categories } = useSelector((state) => state.categories);
  const {error } = useSelector((state) => state.products);

  // useEffect(() => {
  //   dispatch(fetchCategories());
  // }, [dispatch]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // const handleSubmit = async (formData) => {
  //   // try {
  //   //   await dispatch(createProduct(formData)).unwrap();
  //   //   toast.success("Produit créé avec succès");
  //   //   navigate("/admin/products");
  //   // } catch (error) {
  //   //   toast.error("Erreur lors de la création du produit");
  //   // }
  // };

  return (
    <AdminLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Ajouter un nouveau produit</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <ProductForm />
      </div>
    </AdminLayout>
  );
};

export default CreateProductPage;
