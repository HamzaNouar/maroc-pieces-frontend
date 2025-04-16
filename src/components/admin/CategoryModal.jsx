// src/components/admin/CategoryModal.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import {
  createCategory,
  updateCategory,
} from "../../store/slices/categorySlice";

const CategorySchema = Yup.object().shape({
  name: Yup.string().required("Le nom est requis"),
  description: Yup.string(),
});

const CategoryModal = ({ isOpen, onClose, category }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.categories);

  const initialValues = {
    name: category?.name || "",
    description: category?.description || "",
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      if (category) {
        // Update existing category
        await dispatch(updateCategory({ id: category.id, ...values })).unwrap();
        toast.success("Catégorie mise à jour avec succès");
      } else {
        // Create new category
        await dispatch(createCategory(values)).unwrap();
        toast.success("Catégorie créée avec succès");
      }
      resetForm();
      onClose();
    } catch (error) {
      toast.error(
        category
          ? "Erreur lors de la mise à jour de la catégorie"
          : "Erreur lors de la création de la catégorie"
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {category ? "Modifier la catégorie" : "Ajouter une catégorie"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={CategorySchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Nom de la catégorie *
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

                  <div>
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Description
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

                  <div className="flex justify-end space-x-3 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
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
                        : "Enregistrer"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
