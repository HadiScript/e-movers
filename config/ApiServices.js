import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// const API_URL = "http://192.168.100.106:5000/api";
// const API_URL = "http://192.168.238.30:5000/api";
const API_URL = "https://movers-backend-pi.vercel.app/api";

// Setup axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// API service object
const apiService = {
  // User methods
  registerUser: async (name, phone) => {
    try {
      const response = await api.post("/users", { name, phone });

      // Save user data to AsyncStorage for persistent login
      if (response.data.success) {
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(response.data.data)
        );
      }

      return response.data;
    } catch (error) {
      console.error("Register user error:", error);
      throw error;
    }
  },

  // Get current user from AsyncStorage
  getCurrentUser: async () => {
    try {
      const userData = await AsyncStorage.getItem("userData");
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error("Get current user error:", error);
      return null;
    }
  },

  // Clear user data (logout)
  clearUserData: async () => {
    try {
      await AsyncStorage.removeItem("userData");
      return true;
    } catch (error) {
      console.error("Clear user data error:", error);
      return false;
    }
  },

  // Booking methods
  createBooking: async (bookingData) => {
    try {
      const response = await api.post("/bookings", bookingData);
      return response.data;
    } catch (error) {
      console.error("Create booking error:", error);
      throw error;
    }
  },

  getUserBookings: async (userId) => {
    try {
      const response = await api.get(`/bookings/${userId}`);
      return response.data;
    } catch (error) {
      console.error("Get user bookings error:", error);
      throw error;
    }
  },

  getBookingDetails: async (bookingId) => {
    try {
      const response = await api.get(`/booking/${bookingId}`);
      return response.data;
    } catch (error) {
      console.error("Get booking details error:", error);
      throw error;
    }
  },

  // Example function for your booking form submission
  submitBookingForm: async (formData) => {
    try {
      // Get current user from AsyncStorage
      const user = await apiService.getCurrentUser();

      if (!user || !user._id) {
        throw new Error("User not authenticated");
      }

      // Prepare booking data
      const bookingData = {
        userId: user._id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        pickupLocation: formData.pickupLocation,
        dropLocation: formData.dropLocation,
        service: formData.service,
        message: formData.message,
      };

      // Submit booking
      return await apiService.createBooking(bookingData);
    } catch (error) {
      console.error("Submit booking form error:", error);
      throw error;
    }
  },
};

export default apiService;
