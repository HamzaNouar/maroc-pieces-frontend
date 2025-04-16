// src/store/slices/reportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_URL =
  import.meta.env.VITE_BACKEND_URL_API || "https://localhost:7263/api";

// Fetch sales report
export const fetchSalesReport = createAsyncThunk(
  "reports/fetchSales",
  async (dateRange, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const response = await axios.get(
        `${API_URL}/reports/sales?dateRange=${dateRange}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales report"
      );
    }
  }
);

// Fetch top products
export const fetchTopProducts = createAsyncThunk(
  "reports/fetchTopProducts",
  async (dateRange, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const response = await axios.get(
        `${API_URL}/reports/top-products?dateRange=${dateRange}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top products"
      );
    }
  }
);

// Fetch top customers
export const fetchTopCustomers = createAsyncThunk(
  "reports/fetchTopCustomers",
  async (dateRange, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const response = await axios.get(
        `${API_URL}/reports/top-customers?dateRange=${dateRange}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch top customers"
      );
    }
  }
);

// Fetch sales by category
export const fetchSalesByCategory = createAsyncThunk(
  "reports/fetchSalesByCategory",
  async (dateRange, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const response = await axios.get(
        `${API_URL}/reports/sales-by-category?dateRange=${dateRange}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales by category"
      );
    }
  }
);

// Fetch sales timeline
export const fetchSalesTimeline = createAsyncThunk(
  "reports/fetchSalesTimeline",
  async (dateRange, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState();
      const config = {
        headers: {
          Authorization: `Bearer ${auth.token}`,
        },
      };

      const response = await axios.get(
        `${API_URL}/reports/sales-timeline?dateRange=${dateRange}`,
        config
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch sales timeline"
      );
    }
  }
);

// Update the initial state to include timelineData
const initialState = {
  salesData: null,
  topProducts: [],
  topCustomers: [],
  categoryData: [],
  timelineData: [],
  isLoading: false,
  error: null,
};

const reportSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {
    clearReportError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch sales report
      .addCase(fetchSalesReport.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesReport.fulfilled, (state, action) => {
        state.isLoading = false;
        state.salesData = action.payload;
      })
      .addCase(fetchSalesReport.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch top products
      .addCase(fetchTopProducts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopProducts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topProducts = action.payload;
      })
      .addCase(fetchTopProducts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch top customers
      .addCase(fetchTopCustomers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchTopCustomers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.topCustomers = action.payload;
      })
      .addCase(fetchTopCustomers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Fetch sales by category
      .addCase(fetchSalesByCategory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.categoryData = action.payload;
      })
      .addCase(fetchSalesByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Add these cases to the extraReducers builder
      .addCase(fetchSalesTimeline.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchSalesTimeline.fulfilled, (state, action) => {
        state.isLoading = false;
        state.timelineData = action.payload;
      })
      .addCase(fetchSalesTimeline.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReportError } = reportSlice.actions;

export default reportSlice.reducer;
