import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  viewAllPaymentsService,
  deletePaymentService,
} from "../../api/paymentServices";

const AllPayment = () => {
  const [payments, setPayments] = useState([]);
  const [deletingPaymentId, setDeletingPaymentId] = useState(null);

  // Fetch all payments
  const loadPayments = async () => {
    try {
      const data = await viewAllPaymentsService();
      // Optional: sort by status (Cancelled last) and createdAt descending
      const sorted = data.sort((a, b) => {
        if (
          a.status.toLowerCase() === "cancelled" &&
          b.status.toLowerCase() !== "cancelled"
        )
          return 1;
        if (
          b.status.toLowerCase() === "cancelled" &&
          a.status.toLowerCase() !== "cancelled"
        )
          return -1;
        return new Date(b.createdAt) - new Date(a.createdAt);
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

  // Delete payment handler
  const deletePaymentHandler = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this payment?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingPaymentId(id);
      await deletePaymentService(id);
      loadPayments(); // reload payments after deletion
    } catch (err) {
      console.error("Failed to delete payment:", err);
    } finally {
      setDeletingPaymentId(null);
    }
  };

  return (
    <main className="flex-1 px-6">
      <section className="bg-white p-6 rounded-lg shadow-md min-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Payments</h2>
        <div className="grid grid-cols-3 gap-6">
          {payments.length > 0 ? (
            payments.map((payment) => {
              const isCancelled = payment.status?.toLowerCase() === "cancelled";

              return (
                <div
                  key={payment._id}
                  className={`py-5 px-6 mb-4 rounded-xl shadow transition-all duration-300 ${
                    isCancelled ? "bg-red-50 border border-red-300" : "bg-white"
                  }`}
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
                        payment.status.toLowerCase() === "confirmed"
                          ? "text-green-600"
                          : payment.status.toLowerCase() === "pending"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {payment.status}
                    </span>
                  </div>

                  <button
                    onClick={() => deletePaymentHandler(payment._id)}
                    className={`w-full py-2 mt-2 rounded-md border text-center ${
                      isCancelled
                        ? "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
                        : "border-[#b17f44] text-[#b17f44] bg-white hover:bg-[#b17f44] hover:text-white transition"
                    }`}
                    disabled={isCancelled || deletingPaymentId === payment._id}
                  >
                    {deletingPaymentId === payment._id
                      ? "Deleting..."
                      : "Delete Payment"}
                  </button>
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
