import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../../services/api";

const API_URL =
  import.meta.env.VITE_BACKEND_URL_API || "https://localhost:7263/api";

// Helper function to get auth headers
const getAuthHeaders = (token) => {
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// Updated to include pagination parameters
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async ({ page = 1, pageSize = 5 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products`, {
        params: { page, pageSize },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Network error" }
      );
    }
  }
);

// Updated to include pagination parameters
export const searchProducts = createAsyncThunk(
  "products/searchProducts",
  async ({ query, page = 1, pageSize = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/products/search`, {
        params: { query, page, pageSize },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Network error" }
      );
    }
  }
);

// Updated to include pagination parameters
export const filterProducts = createAsyncThunk(
  "products/filterProducts",
  async ({ filters, page = 1, pageSize = 5 }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/Products/filter`, {
        params: { ...filters, page, pageSize },
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Network error" }
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "products/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`/categories`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Network error" }
      );
    }
  }
);

export const fetchProductById = createAsyncThunk(
  "products/fetchProductById",
  async (productId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/products/${productId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data || { message: "Network error" }
      );
    }
  }
);

// ADMIN ACTIONS - Create, Update, Delete

// Create Product (Admin only)
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, { rejectWithValue, getState }) => {
    const { auth } = getState();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      };

      const response = await axios.post(
        `${API_URL}/products`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      // Check for unauthorized access
      if (error.response?.status === 401 || error.response?.status === 403) {
        return rejectWithValue({
          message: "Unauthorized: Admin access required",
        });
      }
      return rejectWithValue(
        error.response?.data || { message: "Failed to create product" }
      );
    }
  }
);

// Update Product (Admin only)
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, { rejectWithValue, getState }) => {
    const { auth } = getState();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
          "Content-Type": "multipart/form-data", // Important for file uploads
        },
      };

      const response = await axios.put(
        `${API_URL}/products/${id}`,
        formData,
        config
      );
      return response.data;
    } catch (error) {
      // Check for unauthorized access
      if (error.response?.status === 401 || error.response?.status === 403) {
        return rejectWithValue({
          message: "Unauthorized: Admin access required",
        });
      }
      return rejectWithValue(
        error.response?.data || { message: "Failed to update product" }
      );
    }
  }
);

// Delete Product (Admin only)
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async ({ productId }, { rejectWithValue, getState }) => {
    const { auth } = getState();
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      await axios.delete(`${API_URL}/products/${productId}`, config);
      return { id: productId };
    } catch (error) {
      // Check for unauthorized access
      if (error.response?.status === 401 || error.response?.status === 403) {
        return rejectWithValue({
          message: "Unauthorized: Admin access required",
        });
      }
      return rejectWithValue(
        error.response?.data || { message: "Failed to delete product" }
      );
    }
  }
);

const initialState = {
  products: [],
  categories: [],
  isLoading: false,
  error: null,
  pagination: {
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    pageSize: 5,
  },
  currentFilters: {},
  currentSearchQuery: "",
  selectedProduct: null,
  // Admin action states
  adminActionLoading: false,
  adminActionSuccess: false,
  adminActionError: null,
};

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    },
    setPageSize: (state, action) => {
      state.pagination.pageSize = action.payload;
    },
    clearAdminActionStatus: (state) => {
      state.adminActionSuccess = false;
      state.adminActionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          pageSize: action.payload.pageSize,
        };
        state.currentFilters = {};
        state.currentSearchQuery = "";
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })

      // Search Products
      .addCase(searchProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          pageSize: action.payload.pageSize,
        };
        state.currentSearchQuery = action.meta.arg.query;
        state.currentFilters = {};
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to search products";
      })

      // Filter Products
      .addCase(filterProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(filterProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.products = action.payload.products;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalItems: action.payload.totalItems,
          pageSize: action.payload.pageSize,
        };
        state.currentFilters = action.meta.arg.filters;
        state.currentSearchQuery = "";
      })
      .addCase(filterProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to filter products";
      })

      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || "Failed to fetch categories";
      })

      // Fetch Product by ID
      .addCase(fetchProductById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.selectedProduct = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message || "Failed to fetch product details";
      })

      // Create Product (Admin)
      .addCase(createProduct.pending, (state) => {
        state.adminActionLoading = true;
        state.adminActionError = null;
        state.adminActionSuccess = false;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.adminActionLoading = false;
        state.adminActionSuccess = true;
        // Add the new product to the products array if we're on the first page
        if (state.pagination.currentPage === 1) {
          state.products = [action.payload, ...state.products.slice(0, -1)];
        }
        // Increment total items count
        state.pagination.totalItems += 1;
        // Recalculate total pages
        state.pagination.totalPages = Math.ceil(
          state.pagination.totalItems / state.pagination.pageSize
        );
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.adminActionLoading = false;
        state.adminActionError =
          action.payload?.message || "Failed to create product";
      })

      // Update Product (Admin)
      .addCase(updateProduct.pending, (state) => {
        state.adminActionLoading = true;
        state.adminActionError = null;
        state.adminActionSuccess = false;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.adminActionLoading = false;
        state.adminActionSuccess = true;
        // Update the product in the products array
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
        // Update selected product if it's the one being viewed
        if (
          state.selectedProduct &&
          state.selectedProduct.id === action.payload.id
        ) {
          state.selectedProduct = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.adminActionLoading = false;
        state.adminActionError =
          action.payload?.message || "Failed to update product";
      })

      // Delete Product (Admin)
      .addCase(deleteProduct.pending, (state) => {
        state.adminActionLoading = true;
        state.adminActionError = null;
        state.adminActionSuccess = false;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.adminActionLoading = false;
        state.adminActionSuccess = true;
        // Remove the product from the products array
        state.products = state.products.filter(
          (product) => product.id !== action.payload.id
        );
        // Decrement total items count
        state.pagination.totalItems -= 1;
        // Recalculate total pages
        state.pagination.totalPages = Math.ceil(
          state.pagination.totalItems / state.pagination.pageSize
        );
        // Clear selected product if it's the one being deleted
        if (
          state.selectedProduct &&
          state.selectedProduct.id === action.payload.id
        ) {
          state.selectedProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.adminActionLoading = false;
        state.adminActionError =
          action.payload?.message || "Failed to delete product";
      });
  },
});

export const { setCurrentPage, setPageSize, clearAdminActionStatus } =
  productSlice.actions;
export default productSlice.reducer;
