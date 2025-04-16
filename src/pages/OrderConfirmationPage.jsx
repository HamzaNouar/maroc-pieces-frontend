// src/pages/OrderConfirmationPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, Link } from "react-router-dom";
import { fetchOrderById } from "../store/slices/orderSlice";
import Layout from "../components/layout/Layout";

const OrderConfirmationPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentOrder, isLoading, error } = useSelector(
    (state) => state.orders
  );

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(parseInt(id)));
    }
  }, [dispatch, id]);

  console.log(currentOrder);
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2">Chargement des détails de la commande...</p>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 text-red-700 p-4 rounded-lg">{error}</div>
          <div className="mt-4">
            <Link to="/" className="text-primary hover:underline">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  if (!currentOrder) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <p>Commande non trouvée.</p>
          <div className="mt-4">
            <Link to="/" className="text-primary hover:underline">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 bg-green-50 border-b border-green-100">
            <div className="flex items-center justify-center mb-4">
              <div className="bg-green-100 rounded-full p-3">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-center text-green-800">
              Commande confirmée!
            </h1>
            <p className="text-center text-green-700 mt-2">
              Merci pour votre commande. Votre numéro de commande est #
              {currentOrder.id}.
            </p>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                Détails de la commande
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600">Date de commande:</p>
                  <p className="font-medium">
                    {new Date(currentOrder.orderDate).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Statut:</p>
                  <p className="font-medium">
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
                      {currentOrder.status}
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Mode de paiement:</p>
                  <p className="font-medium">
                    {currentOrder.paymentMethod === "Cash on Delivery"
                      ? "Paiement à la livraison"
                      : "Virement bancaire"}
                  </p>
                </div>
                <div>
                  <p className="text-gray-600">Total:</p>
                  <p className="font-medium">
                    {currentOrder.totalAmount?.toFixed(2)} DH
                  </p>
                </div>
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">
                Adresse de livraison
              </h2>
              <div className="p-3 border border-gray-200 rounded">
                <p className="font-medium">{currentOrder?.shippingAddress}</p>
                {/* <p>{currentOrder.shippingAddress.address}</p>
                <p>
                  {currentOrder.shippingAddress.city},{" "}
                  {currentOrder.shippingAddress.postalCode}
                </p>
                <p>Téléphone: {currentOrder.shippingAddress.phoneNumber}</p> */}
              </div>
            </div>

            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-3">Articles commandés</h2>
              <div className="border border-gray-200 rounded overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Produit
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
                        Quantité
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentOrder?.orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">
                              {item?.product?.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.price?.toFixed(2)} DH
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {item.quantity}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {(item.price * item.quantity)?.toFixed(2)} DH
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-gray-200">
              <Link to="/" className="text-primary hover:underline">
                Continuer vos achats
              </Link>
              <Link
                to="/profile/orders"
                className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
              >
                Voir mes commandes
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmationPage;
