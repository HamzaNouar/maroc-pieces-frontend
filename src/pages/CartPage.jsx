// src/pages/CartPage.jsx
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../store/slices/cartSlice";
import Layout from "../components/layout/Layout";
import { toast } from "react-toastify";

const CartPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalQuantity, totalAmount } = useSelector(
    (state) => state.cart
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
    toast.info("Produit retiré du panier");
  };

  const handleQuantityChange = (id, quantity, stockQuantity) => {
    if (quantity > 0 && quantity <= stockQuantity) {
      dispatch(updateQuantity({ id, quantity }));
    } else if (quantity > stockQuantity) {
      toast.error(`Quantité maximum disponible: ${stockQuantity}`);
      dispatch(updateQuantity({ id, quantity: stockQuantity }));
    }
  };

  const handleCheckout = () => {
    if (isAuthenticated) {
      navigate("/checkout");
    } else {
      toast.info("Veuillez vous connecter pour continuer");
      navigate("/login", { state: { from: "/cart" } });
    }
  };

  const handleClearCart = () => {
    if (window.confirm("Êtes-vous sûr de vouloir vider votre panier?")) {
      dispatch(clearCart());
      toast.info("Panier vidé");
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Votre Panier</h1>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <p className="text-lg mb-4">Votre panier est vide.</p>
            <Link
              to="/products"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-primary-dark"
            >
              Continuer vos achats
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <h2 className="text-xl font-semibold">
                    Articles ({totalQuantity})
                  </h2>
                </div>

                <ul>
                  {items.map((item) => (
                    <li key={item.id} className="border-b last:border-b-0">
                      <div className="flex items-center p-4">
                        <div className="w-20 h-20 bg-gray-200 flex-shrink-0 mr-4">
                          {item.imageUrl ? (
                            <img
                              src={`${
                                import.meta.env.VITE_BACKEND_IMG ||
                                "https://localhost:7263"
                              }${item.imageUrl}`}
                              alt={item.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-2xl text-gray-500">
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
                          <div className="text-primary font-bold mt-1">
                            {item.price.toFixed(2)} DH
                          </div>
                        </div>

                        <div className="flex items-center">
                          <div className="flex items-center mr-4">
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity - 1,
                                  item.stockQuantity
                                )
                              }
                              className="bg-gray-200 px-2 py-1 rounded-l"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              max={item.stockQuantity}
                              value={item.quantity}
                              onChange={(e) =>
                                handleQuantityChange(
                                  item.id,
                                  parseInt(e.target.value),
                                  item.stockQuantity
                                )
                              }
                              className="w-12 text-center border-t border-b border-gray-300 py-1"
                            />
                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  item.id,
                                  item.quantity + 1,
                                  item.stockQuantity
                                )
                              }
                              className="bg-gray-200 px-2 py-1 rounded-r"
                            >
                              +
                            </button>
                          </div>

                          <button
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              viewBox="0 0 20 20"
                              fill="currentColor"
                            >
                              <path
                                fillRule="evenodd"
                                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>

                <div className="p-4 border-t">
                  <button
                    onClick={handleClearCart}
                    className="text-red-500 hover:text-red-700 flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Vider le panier
                  </button>
                </div>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Récapitulatif</h2>

                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Sous-total</span>
                    <span>{totalAmount.toFixed(2)} DH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Livraison</span>
                    <span>Calculé à la caisse</span>
                  </div>
                  <div className="border-t pt-3 mt-3">
                    <div className="flex justify-between font-bold">
                      <span>Total</span>
                      <span>{totalAmount.toFixed(2)} DH</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-primary text-white py-3 rounded-lg font-medium mt-6 hover:bg-primary-dark"
                >
                  Passer à la caisse
                </button>

                <div className="mt-4">
                  <Link
                    to="/products"
                    className="text-primary hover:underline block text-center"
                  >
                    Continuer vos achats
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CartPage;
