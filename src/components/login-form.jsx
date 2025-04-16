import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { login, clearError } from "../store/slices/authSlice";
import { toast } from "react-toastify";

const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  password: Yup.string().required("Password is required"),
});

const LoginForm = () => {
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

  const handleSubmit = async (values) => {
    dispatch(login(values));
  };

  return (
    <Formik
      initialValues={{ username: "", password: "" }}
      validationSchema={LoginSchema}
      onSubmit={handleSubmit}
    >
      {({ errors, touched }) => (
        <Form className="flex flex-col gap-4">
          <div>
            <Field
              name="username"
              type="text"
              placeholder="Identificateur"
              className="h-14 bg-white text-black w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <ErrorMessage
              name="username"
              component="div"
              className="text-red-400 mt-1"
            />
          </div>

          <div>
            <Field
              name="password"
              type="password"
              placeholder="Mot De Pass"
              className="h-14 bg-white text-black w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-400 mt-1"
            />
          </div>

          <button
            type="submit"
            className="h-14 bg-white text-black hover:bg-gray-100 px-4 py-2 rounded font-medium transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Chargement..." : "Valider"}
          </button>
        </Form>
      )}
    </Formik>
  );
};

export default LoginForm;
