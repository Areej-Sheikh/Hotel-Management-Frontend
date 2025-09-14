import { useEffect, useState, useCallback } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { createBookingService } from "./../api/bookingServices";
import { viewPropertyService } from "../api/propertyServices";
import { toast } from "react-toastify";
import { createRazorpayOrder } from "../api/paymentServices";

const BookingPage = () => {
  const { search } = useLocation();
  const { id } = useParams();

  const data = decodeURIComponent(search)
    .split("?")[1]
    .split("&")
    .reduce((acc, item) => {
      const [key, value] = item.split("=");
      acc[key] = value.replace(/^"|"$/g, "");
      return acc;
    }, {});

  const [paymentId, setPaymentId] = useState("");
  const [status, setStatus] = useState("");
  const [property, setProperty] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);
  const { checkinDate, checkoutDate } = data;

  const navigate = useNavigate();

  const createBookings = useCallback(async () => {
    const bookingData = {
      propertyId: id,
      status: "Confirmed",
      checkinDate,
      checkoutDate,
      totalAmount,
    };

    console.log("Booking Data to be sent:", bookingData);

    try {
      await createBookingService(bookingData);
      toast.success("Booking Confirmed Successfully");
      navigate("/profile");
    } catch (error) {
      toast.error("Failed to create booking. Please try again.");
      console.error(error);
    }
  }, [id, checkinDate, checkoutDate, totalAmount, navigate]);

  const getProperty = useCallback(async (id) => {
    try {
      const propertyData = await viewPropertyService(id);
      setProperty(propertyData);
      console.log("Property data:", propertyData);
    } catch (error) {
      toast.error("Failed to load property details.");
      console.error(error);
    }
  }, []);

  useEffect(() => {
    getProperty(id);
    const total =
      Number(data.price) * Number(data.nights) * Number(data.guests);
    setTotalAmount(total);
  }, [id, search]);
console.log("Total Amount:", totalAmount);

const handleConfirmOrder = async () => {
  try {
    const paymentResult = await createRazorpayOrder(totalAmount);

    console.log("Payment Result:", paymentResult);

    if (
      paymentResult?.status === "captured" ||
      paymentResult?.status === "authorized"
    ) {
      // Razorpay marks payments as "captured" (successful) or sometimes "authorized"
      setStatus(paymentResult.status);
      setPaymentId(paymentResult.id || paymentResult.paymentId);
      await createBookings();
    } else {
      toast.error("Payment failed. Please try again.");
      navigate("/");
    }
  } catch (error) {
    toast.error("Something went wrong with payment.");
    console.error("Payment error:", error);
  }
};

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return `${date.getDate()} ${date.toLocaleString("default", {
      month: "short",
    })} ${date.getFullYear()}`;
  };
  useEffect(() => {
    if (paymentId) {
      console.log("Payment ID:", paymentId);
    }
  }, [paymentId]);

  useEffect(() => {
    if (status) {
      console.log("Payment Status:", status);
    }
  }, [status]);

  useEffect(() => {
    if (property) {
      console.log("Property data:", property);
    }
  }, [property]);

  return (
    <div className="h-screen mt-10 w-full bg-zinc-50 px-40 flex flex-col justify-center items-center">
      <div className="max-w-6xl w-full bg-white rounded-lg shadow-lg p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-2">
          <h1 className="text-2xl font-bold mb-6">Request to book</h1>

          <section className="mb-6">
            <h2 className="text-2xl font-semibold mb-5">Your Trip Details</h2>
            <div className="flex gap-20 items-center mt-10">
              <div>
                <p className="text-xl font-semibold text-black">Dates</p>
                <p className="text-lg font-medium">
                  {formatDate(data.checkinDate)} -{" "}
                  {formatDate(data.checkoutDate)}
                </p>
              </div>
              <div className="text-center">
                <p className="text-xl font-semibold text-black">Guests</p>
                <p className="text-lg font-medium">{data.guests}</p>
              </div>
            </div>

            <div className="flex justify-center mt-8">
              <button
                onClick={handleConfirmOrder}
                className="bg-[#b17f44] text-white font-bold py-2 mt-20 px-10 rounded-lg"
              >
                Book Now
              </button>
            </div>
          </section>
        </div>

        <div>
          <div className="border rounded-lg p-4 flex flex-col gap-4 h-full">
            <div className="flex-row gap-4 ">
              <img
                src={
                  property?.property?.images?.[0] ||
                  "https://via.placeholder.com/80"
                }
                alt={property?.property?.title || "Hotel"}
                className="w-30 h-30 rounded-lg object-cover"
              />
              <div>
                <p className="font-bold text-lg mt-3 text-stone-950">
                  {property?.property?.title || "Hotel Name"}
                </p>
                <p className="text-sm text-gray-600">
                  {property?.property?.location || "Room Location"}
                </p>
              </div>
            </div>

            <h2 className="text-lg font-semibold  text-stone-950">
              Price details
            </h2>
            <div className="flex justify-between text-sm">
              <p>
                ₹{Number(data.price).toLocaleString()} x {data.nights} nights X{" "}
                {data.guests} guests
              </p>
              <p>₹{Number(totalAmount).toLocaleString()}</p>
            </div>
            <div className="flex justify-between font-semibold text-md  text-stone-950  border-t pt-4  mb-2">
              <p>Total (₹)</p>
              <p>₹{Number(totalAmount).toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
