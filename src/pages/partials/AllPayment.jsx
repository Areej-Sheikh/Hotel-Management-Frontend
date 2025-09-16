import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { viewAllPaymentsService } from "../../api/adminServices";

const AllPayment = () => {
  const [payments, setPayments] = useState([]);

  const loadPayments = async () => {
    try {
      const response = await viewAllPaymentsService();
      console.log("Payments response:", response);

      const paymentsArray = Array.isArray(response.data) ? response.data : [];

      const sorted = paymentsArray.sort((a, b) => {
        const statusA = (a.status || "").toLowerCase();
        const statusB = (b.status || "").toLowerCase();

        if (statusA === "cancelled" && statusB !== "cancelled") return 1;
        if (statusB === "cancelled" && statusA !== "cancelled") return -1;

        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      });

      setPayments(sorted);
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("Failed to fetch payments.");
    }
  };


  useEffect(() => {
    loadPayments();
  }, []);

  return (
    <main className="flex-1 px-6">
      <section className="bg-white p-6 rounded-lg shadow-md min-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Payments</h2>
        <div className="grid grid-cols-3 gap-6">
          {payments.length > 0 ? (
            payments.map((payment) => {
              const status = payment.status?.toLowerCase();
              const isCancelled = status === "cancelled";
              const isConfirmed = status === "confirmed";

              return (
                <div
                  key={payment._id}
                  className={`py-5 px-6 mb-4 rounded-xl shadow transition-all duration-300
                    ${
                      isCancelled
                        ? "bg-red-50 border border-red-300 hover:bg-red-100 hover:shadow-red-200"
                        : isConfirmed
                        ? "bg-white border border-green-200 hover:bg-green-50 hover:shadow-green-200"
                        : "bg-white border border-gray-200 hover:shadow-gray-300"
                    }
                  `}
                >
                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-md">Property</span>
                    <span className="text-sm font-light">
                      {payment.property?.title || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-md">Booked by</span>
                    <span className="text-sm font-light">
                      {payment.user?.username || "N/A"}
                    </span>
                  </div>

                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-md">Price</span>
                    <span className="text-sm font-light">
                      ₹{payment.totalPrice}
                    </span>
                  </div>

                  <div className="flex justify-between mb-1">
                    <span className="font-bold text-md">Order ID</span>
                    <span className="text-sm font-light">
                      {payment.razorpayOrderId}
                    </span>
                  </div>

                  <div className="flex justify-between mt-2 mb-2">
                    <span className="font-bold text-md">Payment Status</span>
                    <span
                      className={`text-sm font-bold ${
                        isConfirmed
                          ? "text-green-600"
                          : status === "pending"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>
                </div>
              );
            })
          ) : (
            <p>No payments found.</p>
          )}
        </div>
      </section>
    </main>
  );
};

export default AllPayment;
