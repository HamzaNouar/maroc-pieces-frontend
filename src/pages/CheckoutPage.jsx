// src/pages/CheckoutPage.jsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Layout from "../components/layout/Layout";
import CheckoutForm from "../components/checkout/CheckoutForm";
import OrderSummary from "../components/checkout/OrderSummary";
import { createOrder } from "../store/slices/orderSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalAmount } = useSelector((state) => state.cart);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { isLoading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      toast.info("Votre panier est vide");
      navigate("/cart");
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      toast.info("Veuillez vous connecter pour continuer");
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [items, isAuthenticated, navigate]);

  useEffect(() => {
    // Show error toast if there's an error
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit = async (values, { setSubmitting }) => {

    try {
      const orderData = {
        orderItems: items.map((item) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: values.shippingAddress,
        paymentMethod: values.paymentMethod,
        notes: values.notes,
        totalPrice: totalAmount,
      };

      const resultAction = await dispatch(createOrder(orderData));
      const order = resultAction.payload;


      toast.success("Commande créée avec succès!");
      navigate(`/orders/confirmation/${order.id}`);
    } catch (error) {
      toast.error("Erreur lors de la création de la commande");
    } finally {
      setSubmitting(false);
    }
  };

  if (items.length === 0 || !isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Finaliser la commande</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Checkout Form */}
          <div className="lg:w-2/3">
            <div className="bg-white rounded-lg shadow-md p-6">
              <CheckoutForm onSubmit={handleSubmit} />
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:w-1/3">
            <OrderSummary items={items} totalAmount={totalAmount} />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CheckoutPage;
