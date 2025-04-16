// src/pages/RegisterPage.jsx
import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { register, clearError } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const RegisterSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères")
    .required("Le nom d'utilisateur est requis"),
  email: Yup.string()
    .email("Adresse email invalide")
    .required("L'email est requis"),
  password: Yup.string()
    .min(6, "Le mot de passe doit contenir au moins 6 caractères")
    .required("Le mot de passe est requis"),
  confirmPassword: Yup.string()
    .oneOf(
      [Yup.ref("password"), null],
      "Les mots de passe doivent correspondre"
    )
    .required("La confirmation du mot de passe est requise"),
  firstName: Yup.string().required("Le prénom est requis"),
  lastName: Yup.string().required("Le nom est requis"),
  phoneNumber: Yup.string().required("Le numéro de téléphone est requis"),
  address: Yup.string().required("L'adresse est requise"),
  city: Yup.string().required("La ville est requise"),
});

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    // Redirect if already authenticated
    if (isAuthenticated) {
      navigate("/");
    }

    // Clear any previous errors
    return () => {
      dispatch(clearError());
    };
  }, [isAuthenticated, navigate, dispatch]);

  useEffect(() => {
    // Show error toast if there's an error
    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [error, dispatch]);

  const handleSubmit = async (values, { setSubmitting }) => {
    const userData = {
      username: values.username,
      email: values.email,
      password: values.password,
      firstName: values.firstName,
      lastName: values.lastName,
      phoneNumber: values.phoneNumber,
      address: values.address,
      city: values.city,
    };

    try {
      await dispatch(register(userData)).unwrap();
      toast.success(
        "Inscription réussie! Vous pouvez maintenant vous connecter."
      );
      navigate("/login");
    } catch (error) {
      // Error is handled by the useEffect above
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-primary py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-center mb-6">
              Créer un compte
            </h1>

            <Formik
              initialValues={{
                username: "",
                email: "",
                password: "",
                confirmPassword: "",
                firstName: "",
                lastName: "",
                phoneNumber: "",
                address: "",
                city: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={handleSubmit}
            >
              {({ errors, touched, isSubmitting }) => (
                <Form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="username"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Nom d'utilisateur *
                      </label>
                      <Field
                        name="username"
                        type="text"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage
                        name="username"
                        component="div"
                        className="text-red-500 mt-1 text-sm"
                      />
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
                        htmlFor="password"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Mot de passe *
                      </label>
                      <Field
                        name="password"
                        type="password"
                        className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <ErrorMessage
                        name="password"
                        component="div"
                        className="text-red-500 mt-1 text-sm"
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="confirmPassword"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Confirmer le mot de passe *
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
                        Nom *
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
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700 mb-1"
                      >
                        Numéro de téléphone *
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
                        Adresse *
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
                        Ville *
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
                      className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark"
                    >
                      {isSubmitting ? "Inscription en cours..." : "S'inscrire"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>

            <div className="mt-4 text-center">
              <p>
                Vous avez déjà un compte?{" "}
                <Link to="/login" className="text-primary hover:underline">
                  Se connecter
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
