import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deletePropertyService,
  viewMyPropertyService,
} from "./../api/propertyServices";
import {
  cancelBookingService,
  viewUserBookingService,
} from "../api/bookingServices";
import { toast } from "react-toastify";
import { calculateDuration } from "../utils/Math";

const ProfilePage = () => {
  const user = useSelector((store) => store.user);

  const [bookingsData, setBookingsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);
  const [cancellingBookingId, setCancellingBookingId] = useState(null);

  const loadProperty = async () => {
    try {
      const data = await viewMyPropertyService();
      setPropertiesData(data?.properties || []);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const loadBookings = async () => {
    try {
      if (!user.user?._id) return;
      const res = await viewUserBookingService(user.user._id);

      const sorted = res.sort((a, b) => {
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

      setBookingsData(sorted || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    if (user?.user?._id) {
      loadProperty();
      loadBookings();
    }
  }, [user]);

  const deleteHandler = async (id) => {
    try {
      await deletePropertyService(id);
      toast.success("Property deleted successfully!");
      loadProperty();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property.");
    }
  };

  const bookingCancelHandler = async (id) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this booking?"
    );
    if (!confirmCancel) return;

    try {
      setCancellingBookingId(id);
      await cancelBookingService(id);
      toast.success("Booking cancelled successfully!");
      loadBookings();
    } catch (err) {
      console.error("Booking cancellation failed:", err.message);
    } finally {
      setCancellingBookingId(null);
    }
  };

  return (
    <div className="h-full w-full pt-28 px-20 bg-[#FDF6F0] text-[#333333]">
      <div className="flex h-full relative w-full gap-8">
        {/* Sidebar */}
        <div className="w-[30vw] p-6 py-10 sticky top-[16vh] bg-white rounded-3xl h-fit shadow-[0px_0px_30px_2px_#e4e4e7] flex flex-col items-center space-y-6">
          <div>
            <div className="flex items-center justify-center w-24 h-24 bg-[#B17F44] text-white text-5xl font-bold rounded-full mx-auto">
              {user.user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="text-center mt-4">
              <h2 className="text-4xl text-[#B17F44] font-semibold">
                {user.user?.username || "Guest"}
              </h2>
              <p className="text-[#666666] text-sm">
                {user.user?.isAdmin ? "Admin" : "Guest"}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold">
              {calculateDuration(user.user?.createdAt)}
            </p>
            <p className="text-[#666666] text-xs">on AuraStay</p>
          </div>

          <div className="text-center space-y-1 text-[#666666] text-sm">
            <p>
              Email:{" "}
              <span className="font-semibold text-[#333333]">
                {user.user?.email}
              </span>
            </p>
            <p>
              Bookings:{" "}
              <span className="font-semibold text-[#333333]">
                {bookingsData.length}
              </span>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full pt-2">
          {/* Properties */}
          <h1 className="text-3xl font-bold mb-4 text-[#B17F44]">
            My properties
          </h1>
          <div className="grid grid-cols-3 gap-6">
            {propertiesData.length > 0 ? (
              propertiesData.map((property) => (
                <div
                  key={property._id}
                  className="border rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition flex flex-col h-full"
                >
                  <Link
                    to={`/property/${property._id}`}
                    className="flex flex-col h-full"
                  >
                    <div className="w-full h-60 relative overflow-hidden">
                      {property.images?.[0] && (
                        <img
                          src={property.images[0]}
                          alt={property.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="p-4 flex-1 flex flex-col justify-between">
                      <div>
                        <h2 className="font-semibold text-lg truncate">
                          {property.title}
                        </h2>
                        <p className="text-[#B17F44] font-bold">
                          ₹{property.price} / night
                        </p>
                        <p className="text-[#666666] text-sm truncate">
                          {property.location}
                        </p>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <Link
                          to={`/property/edit/${property._id}`}
                          className="cursor-pointer text-center border border-[#B17F44] text-[#B17F44] rounded-md py-2 w-full hover:bg-[#B17F44]/20 transition"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => deleteHandler(property._id)}
                          className="cursor-pointer text-center bg-[#B17F44] text-white rounded-md py-2 w-full hover:bg-[#B17F44]/20 transition"
                          type="button"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </Link>
                </div>
              ))
            ) : (
              <p>No properties found.</p>
            )}
          </div>

          {/* Bookings */}
          <h1 className="text-3xl font-bold my-4 mt-10 text-[#B17F44]">
            My Bookings
          </h1>
          <div className="grid grid-cols-3 gap-x-3">
            {bookingsData.length > 0 ? (
              bookingsData.map((booking) => {
                const isCancelled =
                  booking.status?.toLowerCase() === "cancelled";
                const statusColor =
                  booking.status?.toLowerCase() === "confirmed"
                    ? "#4CAF50"
                    : booking.status?.toLowerCase() === "pending"
                    ? "#F39C12"
                    : "#E74C3C";

                return (
                  <div
                    key={booking._id}
                    className={`py-5 px-8 mb-2 rounded-xl shadow transition-all duration-300 ${
                      isCancelled
                        ? "bg-[#E74C3C]/10 border border-[#E74C3C]"
                        : "bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <h1 className="text-md font-bold text-[#333333]">
                        Place
                      </h1>
                      <h1 className="text-sm font-light text-[#666666]">
                        {booking.property?.title || "N/A"}
                      </h1>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-bold text-[#333333]">
                        Price
                      </h3>
                      <h3 className="text-sm font-light text-[#666666]">
                        ₹{booking.totalPrice}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-bold text-[#333333]">
                        Status
                      </h3>
                      <h3
                        className="text-sm font-bold"
                        style={{ color: statusColor }}
                      >
                        {booking.status || "N/A"}
                      </h3>
                    </div>

                    <div className="flex items-center justify-between">
                      <h3 className="text-md font-bold text-[#333333]">
                        Order ID
                      </h3>
                      <h3 className="text-sm font-light text-[#666666] truncate">
                        {booking.razorpayOrderId}
                      </h3>
                    </div>

                    <div className="flex justify-between mt-4">
                      <div className="flex flex-col">
                        <h3 className="text-md font-bold text-[#333333]">
                          Check In
                        </h3>
                        <h3 className="text-sm font-light text-[#666666]">
                          {new Date(booking.checkInDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </h3>
                      </div>

                      <div className="flex flex-col items-end">
                        <h3 className="text-md font-bold text-[#333333]">
                          Check Out
                        </h3>
                        <h3 className="text-sm font-light text-[#666666]">
                          {new Date(booking.checkOutDate).toLocaleDateString(
                            "en-GB",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            }
                          )}
                        </h3>
                      </div>
                    </div>

                    <button
                      onClick={() => bookingCancelHandler(booking._id)}
                      className={`cursor-pointer text-center border rounded-md mt-3 py-2 w-full ${
                        isCancelled
                          ? "bg-gray-300 text-gray-600 border-gray-300 cursor-not-allowed"
                          : "border-[#B17F44] text-[#B17F44] bg-white hover:bg-[#B17F44] hover:text-white transition"
                      }`}
                      type="button"
                      disabled={
                        isCancelled || cancellingBookingId === booking._id
                      }
                    >
                      {cancellingBookingId === booking._id
                        ? "Cancelling..."
                        : isCancelled
                        ? "Cancelled"
                        : "Cancel Booking"}
                    </button>
                  </div>
                );
              })
            ) : (
              <p>No bookings found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
