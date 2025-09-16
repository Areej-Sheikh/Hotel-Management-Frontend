import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getBookingService,
  deleteBookingService,
} from "../../api/adminServices";

const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingBookingId, setDeletingBookingId] = useState(null);
  const [sortStatus, setSortStatus] = useState("All");
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        console.log("Fetching all bookings...");
        const data = await getBookingService();
        console.log("Bookings fetched:", data);

        if (data && data.length > 0) {
          setBookings(data);
          toast.success("Bookings loaded successfully!");
        } else {
          toast.info("No bookings found.");
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        toast.error(`Failed to fetch bookings: ${message}`);
        console.error("Fetch bookings error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this booking?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingBookingId(id);
      console.log(`Deleting booking with ID: ${id}...`);
      await deleteBookingService(id);

      toast.success("Booking deleted successfully!");
      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to delete booking: ${message}`);
      console.error("Delete booking error:", error);
    } finally {
      setDeletingBookingId(null);
    }
  };

  const filteredBookings =
    sortStatus === "All"
      ? bookings
      : bookings.filter(
          (b) => b.status.toLowerCase() === sortStatus.toLowerCase()
        );

  if (loading) {
    return (
      <main className="flex-1 px-6">
        <section className="bg-white p-6 rounded-lg shadow-md min-h-[80vh] flex items-center justify-center">
          <h2 className="text-lg font-semibold">Loading bookings...</h2>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">All Bookings</h2>

          {/* 🔥 Sort by Status Dropdown */}
          <div className="relative w-40">
            <button
              onClick={() => setOpen(!open)}
              className="border px-3 py-1 rounded-md w-full text-left"
            >
              {sortStatus}
            </button>
            {open && (
              <ul className="absolute w-full bg-white border rounded-md mt-1 shadow-lg z-10">
                {["All", "Pending", "Confirmed", "Cancelled"].map((status) => (
                  <li
                    key={status}
                    onClick={() => {
                      setSortStatus(status);
                      setOpen(false);
                    }}
                    className="px-4 py-2 hover:bg-blue-100 hover:text-blue-600 cursor-pointer transition-colors rounded-md"
                  >
                    {status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xl border-b">
                <th className="py-2">Property</th>
                <th className="py-2">Booked By</th>
                <th className="py-2">Check-in</th>
                <th className="py-2">Check-out</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr key={booking._id} className="border-b hover:bg-gray-100">
                  <td className="py-2">
                    {booking.property?.title || "Unknown"}
                  </td>
                  <td className="py-2">
                    {booking.user?.username || "Unknown"}
                  </td>
                  <td className="py-2">
                    {new Date(booking.checkInDate).toLocaleDateString()}
                  </td>
                  <td className="py-2">
                    {new Date(booking.checkOutDate).toLocaleDateString()}
                  </td>
                  <td
                    className={`py-2 font-bold ${
                      booking.status.toLowerCase() === "confirmed"
                        ? "text-green-600"
                        : booking.status.toLowerCase() === "pending"
                        ? "text-orange-600"
                        : "text-red-600"
                    }`}
                  >
                    {booking.status}
                  </td>
                  <td className="py-2">
                    <button
                      className={`bg-red-500 text-white rounded-md px-3 py-1 text-sm ${
                        deletingBookingId === booking._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleDelete(booking._id)}
                      disabled={deletingBookingId === booking._id}
                    >
                      {deletingBookingId === booking._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default AllBookings;
