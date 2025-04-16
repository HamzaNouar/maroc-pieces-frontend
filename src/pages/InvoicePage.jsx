// src/pages/InvoicePage.jsx
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Package } from "lucide-react";
import { fetchOrderById } from "../store/slices/orderSlice";

const InvoicePage = () => {
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

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    // Auto-print when the page loads and data is available
    if (currentOrder && !isLoading) {
      setTimeout(() => {
        window.print();
      }, 1000);
    }
  }, [currentOrder, isLoading]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2">Préparation de la facture...</p>
        </div>
      </div>
    );
  }

  if (!currentOrder && !isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Commande non trouvée.
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white p-8 shadow-lg print:shadow-none">
        {/* Invoice Header */}
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">FACTURE</h1>
            <p className="text-gray-600">#{currentOrder.orderNumber}</p>
            <p className="text-gray-600">
              Date: {formatDate(currentOrder.orderDate)}
            </p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-gray-800">
              MAROC PIECES TETOUAN
            </h2>
            <p className="text-gray-600">123 Rue Mohammed V</p>
            <p className="text-gray-600">Tetouan, 93000</p>
            <p className="text-gray-600">Maroc</p>
            <p className="text-gray-600">Tel: +212 62840xxxx</p>
          </div>
        </div>

        {/* Customer Information */}
        <div className="grid grid-cols-2 gap-8 mb-8">
          <div>
            <h3 className="text-gray-800 font-semibold mb-2">Livrer à:</h3>
            <p className="text-gray-600">{`${currentOrder?.shippingAddress
              .split(" ")
              .filter((_, i) => i <= 1)
              .join(" ")
              .toString()}`}</p>
            <p className="text-gray-600">
              {currentOrder?.shippingAddress
                .split(" ")
                .filter((_, i) => i > 1)
                .join(" ")
                .toString()}
            </p>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="border-b-2 border-gray-300">
                <th className="py-2 text-left text-gray-800">Produit</th>
                <th className="py-2 text-right text-gray-800">Prix unitaire</th>
                <th className="py-2 text-right text-gray-800">Quantité</th>
                <th className="py-2 text-right text-gray-800">Total</th>
              </tr>
            </thead>
            <tbody>
              {currentOrder.orderItems?.map((item) => (
                <tr key={item.id} className="border-b border-gray-200">
                  <td className="py-4">
                    <div className="flex items-center">
                      <div className="h-10 w-10 flex-shrink-0 mr-4">
                        {item.product?.imageUrl ? (
                          <img
                            src={`${
                              import.meta.env.VITE_BACKEND_IMG ||
                              "https://localhost:7263"
                            }${item.product.imageUrl}`}
                            alt={item.product.name}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                            <Package className="h-6 w-6" />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-800">
                          {item.product?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.product?.sku || "N/A"}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-right text-gray-600">
                    {item?.price?.toFixed(2)} DH
                  </td>
                  <td className="py-4 text-right text-gray-600">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-right font-medium text-gray-800">
                    {(item.price * item.quantity).toFixed(2)} DH
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Order Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Sous-total:</span>
              <span className="text-gray-800">
                {currentOrder.totalAmount?.toFixed(2)} DH
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">Frais de livraison:</span>
              <span className="text-gray-800">
                {currentOrder.shippingCost?.toFixed(2)} DH
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-gray-600">TVA (20%):</span>
              <span className="text-gray-800">
                {currentOrder.taxAmount?.toFixed(2) || 0} DH
              </span>
            </div>
            <div className="flex justify-between py-2 border-t border-gray-300 font-bold">
              <span className="text-gray-800">Total:</span>
              <span className="text-gray-800">
                {currentOrder.totalAmount?.toFixed(2)} DH
              </span>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="mb-8">
          <h3 className="text-gray-800 font-semibold mb-2">
            Informations de paiement:
          </h3>
          <p className="text-gray-600">
            Méthode de paiement: {currentOrder.paymentMethod || "N/A"}
          </p>
          <p className="text-gray-600">
            Statut de paiement: {currentOrder.isPaid ? "Payée" : "Non payée"}
          </p>
        </div>

        {/* Notes */}
        {currentOrder.notes && (
          <div className="mb-8">
            <h3 className="text-gray-800 font-semibold mb-2">Notes:</h3>
            <p className="text-gray-600">{currentOrder.notes}</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-gray-600 text-sm mt-16">
          <p>Merci pour votre achat chez Maroc Pieces Tetouan!</p>
          <p>
            Pour toute question concernant cette facture, veuillez nous
            contacter au +212 62840xxxx
          </p>
          <p className="mt-2">
            © {new Date().getFullYear()} Maroc Pieces Tetouan. Tous droits
            réservés.
          </p>
        </div>
      </div>
    </div>
  );
};

export default InvoicePage;
