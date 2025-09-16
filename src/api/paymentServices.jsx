import axios from "./axiosConfig.jsx";
import { toast } from "react-toastify";

export const processPayment = async (paymentData) => {
  try {
    const { data } = await axios.post("/payments", paymentData);
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

const paymentFetch = async (paymentId) => {
  try {
    const { data } = await axios.get(`payments/fetch-payment/${paymentId}`);
    return data;
  } catch (error) {
    toast.error(error.response.data.message);
  }
};

export const createRazorpayOrder = async (amount) => {
  try {
    const response = await axios.post("/payments", {
      amount: amount,
      currency: "INR",
    });

    console.log("Amount received from frontend:", amount);
    console.log("Amount sent to Razorpay (paise):", amount * 100);

    if (response.status === 200) {
      console.log("Order created successfully!");
      return handleRazorpayScreen(response.data.data);
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Payment order creation failed"
    );
  }
};
const handleRazorpayScreen = async (orderData) => {
  try {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast.error("Razorpay SDK failed to load!");
      return;
    }

    console.log("===== Razorpay Checkout Started =====");
    console.log("Order ID:", orderData.id);
    console.log("Amount (paise):", Number(orderData.amount));
    console.log("Currency:", orderData.currency);

    return new Promise((resolve, reject) => {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: Number(orderData.amount),
        currency: orderData.currency || "INR",
        order_id: orderData.id,
        name: "Aura Stay",
        description: "Payment Gateway",
        handler: function (response) {
          console.log("===== Payment Handler Called =====");
          console.log("Payment ID:", response.razorpay_payment_id);
          console.log("Order ID:", response.razorpay_order_id);

          paymentFetch(response.razorpay_payment_id)
            .then((status) => {
              if (status.data && status.data.card) {
                console.log("Card Info from Razorpay:", status.data.card);
                console.log(
                  "Card International Flag:",
                  status.data.card.international
                );
                console.log("Card Type:", status.data.card.type);
              }
              resolve(status);
            })
            .catch((error) => {
              console.error("Error fetching payment info:", error);
              reject(error);
            });
        },
        theme: { color: "#b17f44" },
        prefill: {
          name: "",
          email: "",
          contact: "",
        },
        notes: {},
        modal: {
          escape: true,
          ondismiss: () => console.log("Razorpay modal closed"),
        },
      };

      console.log("Razorpay Options:", options);

      const paymentObject = new window.Razorpay(options);

      paymentObject.on("payment.failed", function (response) {
        console.error("Razorpay payment failed:", response.error);
        console.log("Card Info (if available):", response.error.metadata);
        toast.error(`Payment failed: ${response.error.description}`);
      });

      paymentObject.open();
    });
  } catch (error) {
    toast.error("Error in payment!");
    console.error("Razorpay Checkout Error:", error);
  }
};

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};
