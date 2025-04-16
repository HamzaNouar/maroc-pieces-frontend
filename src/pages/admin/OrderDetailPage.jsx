// src/pages/admin/OrderDetailPage.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { ArrowLeft, Printer, Truck, Package, Check, X } from "lucide-react";
import AdminLayout from "../../components/admin/AdminLayout";
import {
  fetchOrderById,
  updateOrderStatus,
} from "../../store/slices/orderSlice";

const OrderDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentOrder, isLoading, error } = useSelector(
    (state) => state.orders
  );
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);

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

  const handleStatusChange = async (newStatus) => {
    try {
      await dispatch(
        updateOrderStatus({ id: currentOrder.id, status: newStatus })
      ).unwrap();

      dispatch(fetchOrderById(Number.parseInt(id)));
      toast.success(`Statut de la commande mis à jour: ${newStatus}`);
      setStatusDropdownOpen(false);
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du statut de la commande");
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "processing":
        return "bg-blue-100 text-blue-800";
      case "shipped":
        return "bg-purple-100 text-purple-800";
      case "delivered":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("fr-FR", options);
  };

  const handlePrint = () => {
    window.print();
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
          <p className="mt-2">Chargement de la commande...</p>
        </div>
      </AdminLayout>
    );
  }

  if (!currentOrder && !isLoading) {
    return (
      <AdminLayout>
        <div className="bg-red-100 text-red-700 p-4 rounded-lg">
          Commande non trouvée.
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="mb-6 flex justify-between items-center">
        <div className="flex items-center">
          <button
            onClick={() => navigate("/admin/orders")}
            className="mr-4 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Commande #{currentOrder?.id}</h1>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={handlePrint}
            className="flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            <Printer className="h-4 w-4 mr-2" />
            Imprimer
          </button>
          <div className="relative">
            <button
              onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
              className={`flex items-center px-3 py-2 border rounded-md shadow-sm text-sm font-medium ${getStatusColor(
                currentOrder?.status
              )}`}
            >
              {currentOrder?.status}
              <svg
                className="ml-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
            {statusDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                <div className="py-1" role="menu" aria-orientation="vertical">
                  <button
                    onClick={() => handleStatusChange("Pending")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    En attente
                  </button>
                  <button
                    onClick={() => handleStatusChange("Processing")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    En traitement
                  </button>
                  <button
                    onClick={() => handleStatusChange("Shipped")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Expédiée
                  </button>
                  <button
                    onClick={() => handleStatusChange("Delivered")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Livrée
                  </button>
                  <button
                    onClick={() => handleStatusChange("Cancelled")}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    role="menuitem"
                  >
                    Annulée
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h2 className="font-semibold">Détails de la commande</h2>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Date de commande</p>
                  <p className="text-sm font-medium">
                    {formatDate(currentOrder?.orderDate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Statut de paiement</p>
                  <p className="text-sm font-medium">
                    {currentOrder?.isPaid ? (
                      <span className="text-green-600 flex items-center">
                        <Check className="h-4 w-4 mr-1" /> Payée
                      </span>
                    ) : (
                      <span className="text-red-600 flex items-center">
                        <X className="h-4 w-4 mr-1" /> Non payée
                      </span>
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Méthode de paiement</p>
                  <p className="text-sm font-medium">
                    {currentOrder?.paymentMethod || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date de livraison</p>
                  <p className="text-sm font-medium">
                    {formatDate(currentOrder?.deliveredAt) || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Order items */}
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h2 className="font-semibold">Articles commandés</h2>
            </div>
            <div className="overflow-x-auto">
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
                      Prix unitaire
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
                  {currentOrder?.orderItems?.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
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
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product?.name}
                            </div>
                            <div className="text-sm text-gray-500">
                              {item.product?.sku || "N/A"}
                            </div>
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
                          {(item.price * item.quantity).toFixed(2)} DH
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50">
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-sm text-right font-medium"
                    >
                      Sous-total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentOrder?.totalAmount?.toFixed(2)} DH
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-sm text-right font-medium"
                    >
                      Frais de livraison
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentOrder?.shippingCost?.toFixed(2)} DH
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-sm text-right font-medium"
                    >
                      TVA (20%)
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {currentOrder?.taxAmount?.toFixed(2) || 0} DH
                    </td>
                  </tr>
                  <tr>
                    <td
                      colSpan="3"
                      className="px-6 py-4 text-sm text-right font-bold"
                    >
                      Total
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {currentOrder?.totalAmount?.toFixed(2)} DH
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        </div>

        {/* Customer and shipping info */}
        <div className="space-y-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h2 className="font-semibold">Informations client</h2>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium">{`${currentOrder?.user?.firstName} ${currentOrder?.user?.lastName}`}</p>
              <p className="text-sm text-gray-500">
                {currentOrder?.user?.email}
              </p>
              <p className="text-sm text-gray-500">
                {currentOrder?.user?.phoneNumber}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h2 className="font-semibold">Adresse de livraison</h2>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium">{`${currentOrder?.shippingAddress
                .split(" ")
                .filter((_, i) => i <= 1)
                .join(" ")
                .toString()}`}</p>
              <p className="text-sm text-gray-500">
                {currentOrder?.shippingAddress
                  .split(" ")
                  .filter((_, i) => i > 1)
                  .join(" ")
                  .toString()}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-4 py-3 border-b">
              <h2 className="font-semibold">Adresse de facturation</h2>
            </div>
            <div className="p-4">
              <p className="text-sm font-medium">{`${currentOrder?.shippingAddress
                .split(" ")
                .filter((_, i) => i <= 1)
                .join(" ")
                .toString()}`}</p>
              <p className="text-sm text-gray-500">
                {currentOrder?.shippingAddress
                  .split(" ")
                  .filter((_, i) => i > 1)
                  .join(" ")
                  .toString()}
              </p>
            </div>
          </div>

          {currentOrder?.notes && (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <div className="px-4 py-3 border-b">
                <h2 className="font-semibold">Notes</h2>
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-700">{currentOrder.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default OrderDetailPage;
