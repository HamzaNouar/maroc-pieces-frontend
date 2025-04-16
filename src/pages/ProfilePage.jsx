// src/pages/ProfilePage.jsx
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import Layout from "../components/layout/Layout";
import { Link, useNavigate } from "react-router-dom";
// This would be a new action in your authSlice
import { updateProfile } from "../store/slices/userSlice";

const ProfileSchema = Yup.object().shape({
  firstName: Yup.string().required("Le prénom est requis"),
  lastName: Yup.string().required("Le nom est requis"),
  email: Yup.string().email("Email invalide").required("L'email est requis"),
  phoneNumber: Yup.string().required("Le numéro de téléphone est requis"),
  address: Yup.string().required("L'adresse est requise"),
  city: Yup.string().required("La ville est requise"),
});

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("profile");

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Use await to properly catch any errors
      const resultAction = await dispatch(updateProfile(values));

      // Check if the action was fulfilled or rejected
      if (updateProfile.fulfilled.match(resultAction)) {
        toast.success("Profil mis à jour avec succès");
      } else if (updateProfile.rejected.match(resultAction)) {
        // If rejected, show the error message
        const errorMessage =
          resultAction.payload ||
          resultAction.error.message ||
          "Erreur lors de la mise à jour du profil";
        toast.error(errorMessage);
      }
    } catch (error) {
      // This will catch any other errors that might occur
      console.error("Profile update error:", error);
      toast.error(error?.message || "Erreur lors de la mise à jour du profil");
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <p>Chargement du profil...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Mon Compte</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-4 bg-gray-50 border-b">
                <h2 className="font-semibold">Navigation</h2>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setActiveTab("profile")}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeTab === "profile"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Mon Profil
                </button>
                <Link
                  to="/profile/orders"
                  className="block w-full text-left px-4 py-2 rounded hover:bg-gray-100"
                >
                  Mes Commandes
                </Link>
                <button
                  onClick={() => setActiveTab("password")}
                  className={`w-full text-left px-4 py-2 rounded ${
                    activeTab === "password"
                      ? "bg-primary text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  Changer le mot de passe
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="md:w-3/4">
            <div className="bg-white rounded-lg shadow-md p-6">
              {activeTab === "profile" && (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    Informations personnelles
                  </h2>

                  <Formik
                    initialValues={{
                      firstName: user.firstName || "",
                      lastName: user.lastName || "",
                      email: user.email || "",
                      phoneNumber: user.phoneNumber || "",
                      address: user.address || "",
                      city: user.city || "",
                    }}
                    validationSchema={ProfileSchema}
                    onSubmit={handleSubmit}
                  >
                    {({ errors, touched, isSubmitting }) => (
                      <Form className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label
                              htmlFor="firstName"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Prénom
                            </label>
                            <Field
                              name="firstName"
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
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
                              Nom
                            </label>
                            <Field
                              name="lastName"
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <ErrorMessage
                              name="lastName"
                              component="div"
                              className="text-red-500 mt-1 text-sm"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="email"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Email
                            </label>
                            <Field
                              name="email"
                              type="email"
                              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <ErrorMessage
                              name="email"
                              component="div"
                              className="text-red-500 mt-1 text-sm"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="phoneNumber"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Numéro de téléphone
                            </label>
                            <Field
                              name="phoneNumber"
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <ErrorMessage
                              name="phoneNumber"
                              component="div"
                              className="text-red-500 mt-1 text-sm"
                            />
                          </div>

                          <div className="md:col-span-2">
                            <label
                              htmlFor="address"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Adresse
                            </label>
                            <Field
                              name="address"
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <ErrorMessage
                              name="address"
                              component="div"
                              className="text-red-500 mt-1 text-sm"
                            />
                          </div>

                          <div>
                            <label
                              htmlFor="city"
                              className="block text-sm font-medium text-gray-700 mb-1"
                            >
                              Ville
                            </label>
                            <Field
                              name="city"
                              type="text"
                              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                            />
                            <ErrorMessage
                              name="city"
                              component="div"
                              className="text-red-500 mt-1 text-sm"
                            />
                          </div>
                        </div>

                        <div className="mt-6">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                          >
                            {isSubmitting
                              ? "Enregistrement..."
                              : "Enregistrer les modifications"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </>
              )}

              {activeTab === "password" && (
                <>
                  <h2 className="text-xl font-semibold mb-4">
                    Changer le mot de passe
                  </h2>

                  <Formik
                    initialValues={{
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    }}
                    validationSchema={Yup.object().shape({
                      currentPassword: Yup.string().required(
                        "Le mot de passe actuel est requis"
                      ),
                      newPassword: Yup.string()
                        .min(
                          6,
                          "Le mot de passe doit contenir au moins 6 caractères"
                        )
                        .required("Le nouveau mot de passe est requis"),
                      confirmPassword: Yup.string()
                        .oneOf(
                          [Yup.ref("newPassword"), null],
                          "Les mots de passe doivent correspondre"
                        )
                        .required(
                          "La confirmation du mot de passe est requise"
                        ),
                    })}
                    onSubmit={(values, { setSubmitting, resetForm }) => {
                      // This would be implemented in your authSlice
                      setTimeout(() => {
                        toast.success("Mot de passe mis à jour avec succès");
                        resetForm();
                        setSubmitting(false);
                      }, 1000);
                    }}
                  >
                    {({ errors, touched, isSubmitting }) => (
                      <Form className="space-y-4">
                        <div>
                          <label
                            htmlFor="currentPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Mot de passe actuel
                          </label>
                          <Field
                            name="currentPassword"
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <ErrorMessage
                            name="currentPassword"
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="newPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Nouveau mot de passe
                          </label>
                          <Field
                            name="newPassword"
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <ErrorMessage
                            name="newPassword"
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-medium text-gray-700 mb-1"
                          >
                            Confirmer le nouveau mot de passe
                          </label>
                          <Field
                            name="confirmPassword"
                            type="password"
                            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                          />
                          <ErrorMessage
                            name="confirmPassword"
                            component="div"
                            className="text-red-500 mt-1 text-sm"
                          />
                        </div>

                        <div className="mt-6">
                          <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
                          >
                            {isSubmitting
                              ? "Mise à jour..."
                              : "Mettre à jour le mot de passe"}
                          </button>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default ProfilePage;
