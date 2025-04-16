// src/components/checkout/OrderSummary.jsx
import React from "react";
import { Link } from "react-router-dom";

const OrderSummary = ({ items, totalAmount }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Récapitulatif de la commande</h2>
      </div>

      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.id} className="p-4 flex items-center">
            <div className="w-16 h-16 bg-gray-200 flex-shrink-0 mr-4">
              {item.imageUrl ? (
                <img
                  src={`${
                    import.meta.env.VITE_BACKEND_IMG || "https://localhost:7263"
                  }"
                  ${item.imageUrl}`}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-xl text-gray-500">
                  {item.name.charAt(0)}
                </div>
              )}
            </div>

            <div className="flex-grow">
              <Link
                to={`/products/${item.id}`}
                className="font-medium hover:text-primary"
              >
                {item.name}
              </Link>
              <div className="text-sm text-gray-500">
                Quantité: {item.quantity}
              </div>
            </div>

            <div className="text-primary font-bold">
              {(item.price * item.quantity).toFixed(2)} DH
            </div>
          </li>
        ))}
      </ul>

      <div className="p-4 bg-gray-50">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Sous-total</span>
            <span>{totalAmount.toFixed(2)} DH</span>
          </div>
          <div className="flex justify-between">
            <span>Livraison</span>
            <span>Gratuite</span>
          </div>
          <div className="border-t pt-2 mt-2">
            <div className="flex justify-between font-bold">
              <span>Total</span>
              <span>{totalAmount.toFixed(2)} DH</span>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 border-t">
        <Link
          to="/cart"
          className="text-primary hover:underline flex items-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Retour au panier
        </Link>
      </div>
    </div>
  );
};

export default OrderSummary;
