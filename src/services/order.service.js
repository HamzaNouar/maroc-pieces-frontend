// src/services/order.service.js
import api from "./api";

const OrderService = {
  createOrder: async (orderData) => {
    const response = await api.post("/orders", orderData);
    return response.data;
  },

  getOrders: async () => {
    const response = await api.get("/orders/admin");
    return response.data;
  },

  getUserOrders: async () => {
    const response = await api.get("/orders/my-orders");
    return response.data;
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`);
    return response.data;
  },

  updateOrderStatus: async (id, status) => {
    const response = await api.put(`/orders/${id}/status`, status);
    return response.data;
  },

  cancelOrder: async (id) => {
    // Use the updateOrderStatus method with "Cancelled" status
    return await OrderService.updateOrderStatus(id, "Cancelled");
  },
};

export default OrderService;
