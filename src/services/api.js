import axios from "axios";

// 🔥 Base API
const API = axios.create({
  baseURL: "https://meterflow-backend-8aet.onrender.com/api"
});

// ✅ API KEY
export const API_KEY = "03c63fce-b0d6-4040-9b17-559ab6ec247a";

// ✅ JWT TOKEN
export const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY5ZWU0NGUyZjY1MjJlNDBmYWI1MjRmNSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzc3MzE4MzE2LCJleHAiOjE3Nzc5MjMxMTZ9.-IwIO69AzKdR8DLnFZY1hH9AvpDyNFT2FdlHYa2t9bk";

// 🔥 FETCH USAGE
export const fetchUsage = async () => {
  return await API.get("/usage", {
    headers: {
      "x-api-key": API_KEY
    }
  });
};

// 🔥 FETCH BILLING
export const fetchBilling = async () => {
  try {
    return await API.get("/billing/get", {
      headers: {
        "x-api-key": API_KEY,
        Authorization: `Bearer ${TOKEN}`
      }
    });
  } catch (err) {
    console.error("Billing error:", err.response?.data);
    return { data: null };
  }
};

// 🔥 FETCH POKEMON
export const fetchPokemon = async (name) => {
  return await API.get(`/pokemon/${name}`, {
    headers: {
      "x-api-key": API_KEY
    }
  });
};

// 💳 CREATE ORDER
export const createOrder = async () => {
  return await API.post(
    "/payment/create-order",
    {},
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "x-api-key": API_KEY
      }
    }
  );
};

// 💳 VERIFY PAYMENT
export const verifyPayment = async (paymentData) => {
  return await API.post(
    "/payment/verify",
    paymentData,
    {
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "x-api-key": API_KEY
      }
    }
  );
};