// src/components/admin/ProductForm.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { fetchCategories } from "../../store/slices/categorySlice";
import { createProduct, updateProduct } from "../../store/slices/productSlice";
import { Upload } from "lucide-react";

const ProductSchema = Yup.object().shape({
  name: Yup.string().required("Le nom est requis"),
  description: Yup.string().required("La description est requise"),
  price: Yup.number()
    .required("Le prix est requis")
    .positive("Le prix doit être positif"),
  categoryId: Yup.number()
    .required("La catégorie est requise")
    .positive("Veuillez sélectionner une catégorie"),
  stockQuantity: Yup.number()
    .required("La quantité en stock est requise")
    .min(0, "La quantité ne peut pas être négative"),
  sku: Yup.string().required("Le SKU est requis"),
});

const ProductForm = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories } = useSelector((state) => state.categories);
  const { isLoading } = useSelector((state) => state.products);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());

    // Set image preview if product has an image
    if (product?.imageUrl) {
      setImagePreview(
        `${import.meta.env.VITE_BACKEND_IMG || "https://localhost:7263"}${
          product.imageUrl
        }`
      );
    }
  }, [dispatch, product]);

  const initialValues = {
    name: product?.name || "",
    description: product?.description || "",
    price: product?.price || "",
    categoryId: product?.categoryId || "",
    stockQuantity: product?.stockQuantity || 0,
    sku: product?.sku || "",
    isActive: product?.isActive !== undefined ? product.isActive : true,
    isFeatured: product?.isFeatured || false,
  };

  const handleImageChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    if (file) {
      setImageFile(file);
      setFieldValue("image", file);

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Create FormData object to handle file upload
      const formData = new FormData();

      // Add all form fields to FormData
      Object.keys(values).forEach((key) => {
        if (key !== "image") {
          // Skip image as we'll handle it separately
          formData.append(key, values[key]);
        }
      });

      // Add image file if it exists
      if (imageFile) {
        formData.append("image", imageFile);
      }

      // // Log formData contents for debugging
      // for (let pair of formData.entries()) {
      //   console.log(pair[0] + ": " + pair[1]);
      // }

      if (product) {
        // Update existing product
        await dispatch(updateProduct({ id: product.id, formData })).unwrap();
        toast.success("Produit mis à jour avec succès");
      } else {
        // Create new product
        await dispatch(createProduct(formData)).unwrap();
        toast.success("Produit créé avec succès");
      }

      // Navigate back to products list
      navigate("/admin/products");
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error(
        product
          ? "Erreur lors de la mise à jour du produit"
          : "Erreur lors de la création du produit"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={ProductSchema}
      onSubmit={handleSubmit}
      enableReinitialize
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => (
        <Form className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom du produit *
                </label>
                <Field
                  name="name"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="name"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description *
                </label>
                <Field
                  as="textarea"
                  name="description"
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Prix (DH) *
                </label>
                <Field
                  name="price"
                  type="number"
                  step="0.01"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="price"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="categoryId"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Catégorie *
                </label>
                <Field
                  as="select"
                  name="categoryId"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="categoryId"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>
            </div>

            <div>
              <div className="mb-4">
                <label
                  htmlFor="sku"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  SKU (Référence) *
                </label>
                <Field
                  name="sku"
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="sku"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              <div className="mb-4">
                <label
                  htmlFor="stockQuantity"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Quantité en stock *
                </label>
                <Field
                  name="stockQuantity"
                  type="number"
                  className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="stockQuantity"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Image du produit
                </label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {imagePreview ? (
                      <div className="mb-3">
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="mx-auto h-32 w-32 object-cover rounded"
                        />
                      </div>
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="flex text-sm text-gray-600">
                      <label
                        htmlFor="image"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary-dark focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                      >
                        <span>Télécharger une image</span>
                        <input
                          id="image"
                          name="image"
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={(e) => handleImageChange(e, setFieldValue)}
                        />
                      </label>
                      <p className="pl-1">ou glisser-déposer</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF jusqu'à 5MB
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4 mt-2">
                <div className="flex items-center">
                  <Field
                    name="isActive"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isActive"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Actif
                  </label>
                </div>

                <div className="flex items-center">
                  <Field
                    name="isFeatured"
                    type="checkbox"
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label
                    htmlFor="isFeatured"
                    className="ml-2 block text-sm text-gray-700"
                  >
                    Produit en vedette
                  </label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={() => navigate("/admin/products")}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
            >
              {isSubmitting || isLoading
                ? "Enregistrement..."
                : product
                ? "Mettre à jour"
                : "Créer"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default ProductForm;
