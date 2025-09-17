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
      <section className="bg-[#FDF6F0] p-6 rounded-lg shadow-md min-h-[80vh]">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-[#B17F44]">All Bookings</h2>

          {/* Sort by Status Dropdown */}
          <div className="relative w-40">
            <button
              onClick={() => setOpen(!open)}
              className="border border-[#B17F44] px-3 py-1 rounded-md w-full text-left text-[#B17F44] hover:bg-[#B17F44]/10 transition"
            >
              {sortStatus}
            </button>
            {open && (
              <ul className="absolute w-full bg-[#FDF6F0] border border-[#B17F44] rounded-md mt-1 shadow-lg z-10">
                {["All", "Confirmed", "Cancelled"].map((status) => (
                  <li
                    key={status}
                    onClick={() => {
                      setSortStatus(status);
                      setOpen(false);
                    }}
                    className="px-4 py-2 cursor-pointer rounded-md hover:bg-[#B17F44] hover:text-[#FDF6F0] transition-colors"
                  >
                    {status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {filteredBookings.length === 0 ? (
          <p className="text-[#B17F44]">No bookings found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-lg border-b border-[#B17F44]">
                <th className="py-2 text-[#B17F44]">Property</th>
                <th className="py-2 text-[#B17F44]">Booked By</th>
                <th className="py-2 text-[#B17F44]">Check-in</th>
                <th className="py-2 text-[#B17F44]">Check-out</th>
                <th className="py-2 text-[#B17F44]">Status</th>
                <th className="py-2 text-[#B17F44]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.map((booking) => (
                <tr
                  key={booking._id}
                  className="border-b border-[#B17F44] hover:bg-[#f9e9db] hover:text-[#FDF6F0] transition-colors"
                >
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
                        : "text-red-600"
                    }`}
                  >
                    {booking.status}
                  </td>
                  <td className="py-2">
                    <button
                      className={`bg-[#B17F44] text-[#FDF6F0] rounded-md px-3 py-1 text-sm transition hover:bg-[#9b6b37] ${
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
