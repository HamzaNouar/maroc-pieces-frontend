// src/components/checkout/CheckoutForm.jsx
import { useState } from "react";
import { useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const CheckoutSchema = Yup.object().shape({
  shippingAddress: Yup.object().shape({
    fullName: Yup.string().required("Le nom complet est requis"),
    address: Yup.string().required("L'adresse est requise"),
    city: Yup.string().required("La ville est requise"),
    postalCode: Yup.string().required("Le code postal est requis"),
    phoneNumber: Yup.string().required("Le numéro de téléphone est requis"),
  }),
  paymentMethod: Yup.string().required(
    "Veuillez sélectionner un mode de paiement"
  ),
});

const CheckoutForm = ({ onSubmit }) => {
  const { user } = useSelector((state) => state.auth);
  const [useProfileAddress, setUseProfileAddress] = useState(true);

  // Ensure we have default values for all fields to prevent null/undefined
  const initialValues = {
    shippingAddress: {
      fullName:
        useProfileAddress && user
          ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
          : "",
      address: useProfileAddress && user ? user.address || "" : "",
      city: useProfileAddress && user ? user.city || "" : "",
      postalCode: useProfileAddress && user ? user.postalCode || "" : "",
      phoneNumber: useProfileAddress && user ? user.phoneNumber || "" : "",
    },
    paymentMethod: "Cash on Delivery",
    notes: "",
  };

  const handleToggleAddress = (setFieldValue) => {
    setUseProfileAddress(!useProfileAddress);

    if (!useProfileAddress && user) {
      // Switch to profile address - ensure we have default values
      setFieldValue(
        "shippingAddress.fullName",
        `${user.firstName || ""} ${user.lastName || ""}`.trim()
      );
      setFieldValue("shippingAddress.address", user.address || "");
      setFieldValue("shippingAddress.city", user.city || "");
      setFieldValue("shippingAddress.postalCode", user.postalCode || "");
      setFieldValue("shippingAddress.phoneNumber", user.phoneNumber || "");
    } else {
      // Switch to new address
      setFieldValue("shippingAddress.fullName", "");
      setFieldValue("shippingAddress.address", "");
      setFieldValue("shippingAddress.city", "");
      setFieldValue("shippingAddress.postalCode", "");
      setFieldValue("shippingAddress.phoneNumber", "");
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={CheckoutSchema}
      onSubmit={onSubmit}
      enableReinitialize={true} // Add this to handle user data changes
    >
      {({ errors, touched, isSubmitting, setFieldValue }) => (
        <Form className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Adresse de livraison</h2>

            {user && (
              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={useProfileAddress}
                    onChange={() => handleToggleAddress(setFieldValue)}
                    className="mr-2"
                  />
                  <span>Utiliser l'adresse de mon profil</span>
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="shippingAddress.fullName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Nom complet *
                </label>
                <Field
                  name="shippingAddress.fullName"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="shippingAddress.fullName"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="shippingAddress.phoneNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Numéro de téléphone *
                </label>
                <Field
                  name="shippingAddress.phoneNumber"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="shippingAddress.phoneNumber"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="shippingAddress.address"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Adresse *
                </label>
                <Field
                  name="shippingAddress.address"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="shippingAddress.address"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="shippingAddress.city"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Ville *
                </label>
                <Field
                  name="shippingAddress.city"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="shippingAddress.city"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>

              <div>
                <label
                  htmlFor="shippingAddress.postalCode"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Code postal *
                </label>
                <Field
                  name="shippingAddress.postalCode"
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <ErrorMessage
                  name="shippingAddress.postalCode"
                  component="div"
                  className="text-red-500 mt-1 text-sm"
                />
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Mode de paiement</h2>

            <div className="space-y-2">
              <label className="flex items-center p-3 border border-gray-300 rounded">
                <Field
                  type="radio"
                  name="paymentMethod"
                  value="Cash on Delivery"
                  className="mr-2"
                />
                <span>Paiement à la livraison</span>
              </label>

              <label className="flex items-center p-3 border border-gray-300 rounded">
                <Field
                  type="radio"
                  name="paymentMethod"
                  value="PayPal"
                  className="mr-2"
                />
                <span>Virement bancaire</span>
              </label>

              <ErrorMessage
                name="paymentMethod"
                component="div"
                className="text-red-500 mt-1 text-sm"
              />
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Notes (optionnel)</h2>

            <Field
              as="textarea"
              name="notes"
              rows="4"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary"
              placeholder="Instructions spéciales pour la livraison ou autres remarques..."
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark"
            >
              {isSubmitting
                ? "Traitement en cours..."
                : "Confirmer la commande"}
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default CheckoutForm;
