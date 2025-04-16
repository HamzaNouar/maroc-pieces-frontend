// src/components/admin/UserModal.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { X } from "lucide-react";
import { createUser, updateUser } from "../../store/slices/userSlice";

// Fix the validation schema
const UserSchema = (isNewUser) => {
  return Yup.object().shape({
    firstName: Yup.string().required("Le prénom est requis"),
    lastName: Yup.string().required("Le nom est requis"),
    email: Yup.string().email("Email invalide").required("L'email est requis"),
    password: isNewUser
      ? Yup.string()
          .required("Le mot de passe est requis")
          .min(6, "Le mot de passe doit contenir au moins 6 caractères")
      : Yup.string().min(
          6,
          "Le mot de passe doit contenir au moins 6 caractères"
        ),
    phone: Yup.string(),
    isAdmin: Yup.boolean(),
    isActive: Yup.boolean(),
  });
};

const UserModal = ({ isOpen, onClose, user }) => {
  const dispatch = useDispatch();
  const { isLoading } = useSelector((state) => state.users);
  const isNewUser = !user;

  const initialValues = {
    firstName: user?.firstName || "",
    userName: user?.userName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    password: "",
    phone: user?.phone || "",
    isAdmin: user?.isAdmin || false,
    isActive: user?.isActive !== undefined ? user.isActive : true,
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const userData = { ...values };

      // If password is empty and updating user, remove it from the payload
      if (!userData.password && user) {
        delete userData.password;
      }

      if (user) {
        // Update existing user
        await dispatch(updateUser({ id: user.id, ...userData })).unwrap();
        toast.success("Utilisateur mis à jour avec succès");
      } else {
        // Create new user
        await dispatch(createUser(userData)).unwrap();
        toast.success("Utilisateur créé avec succès");
      }
      resetForm();
      onClose();
    } catch (error) {
      toast.error(
        user
          ? "Erreur lors de la mise à jour de l'utilisateur"
          : "Erreur lors de la création de l'utilisateur"
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
                {user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}
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
              validationSchema={UserSchema(isNewUser)}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Prénom *
                      </label>
                      <Field
                        name="firstName"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage
                        name="firstName"
                        component="div"
                        className="text-red-500 mt-1 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nom *
                      </label>
                      <Field
                        name="lastName"
                        type="text"
                        className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage
                        name="lastName"
                        component="div"
                        className="text-red-500 mt-1 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Email *
                    </label>
                    <Field
                      name="email"
                      type="email"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      {user
                        ? "Mot de passe (laisser vide pour ne pas changer)"
                        : "Mot de passe *"}
                    </label>
                    <Field
                      name="password"
                      type="password"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 mt-1 text-sm"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      Téléphone
                    </label>
                    <Field
                      name="phone"
                      type="text"
                      className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-red-500 mt-1 text-sm"
                    />
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Field
                        name="isAdmin"
                        type="checkbox"
                        className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                      />
                      <label
                        htmlFor="isAdmin"
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Administrateur
                      </label>
                    </div>

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

export default UserModal;
