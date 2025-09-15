import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deletePropertyService,
  viewMyPropertyService,
} from "./../api/propertyServices";
import { viewUserBookingService } from "../api/bookingServices";
import { toast } from "react-toastify";
import { calculateDuration } from "../utils/Math";

const ProfilePage = () => {
  const user = useSelector((store) => store.user);
  console.log("Redux user state:", user);

  const [bookingsData, setBookingsData] = useState([]);
  const [propertiesData, setPropertiesData] = useState([]);

  // Load properties
  const loadProperty = async () => {
    try {
      const data = await viewMyPropertyService();
      setPropertiesData(data?.properties || []);
      console.log("Property data fetched:", data?.properties);
    } catch (err) {
      console.error("Error fetching properties:", err);
    }
  };

  const loadBookings = async () => {
    try {
      if (!user.user?._id) return;
      const res = await viewUserBookingService(user.user._id);
      console.log("Bookings fetched from API:", res);
      setBookingsData(res || []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
    }
  };

  useEffect(() => {
    if (user?.user?._id) {
      console.log("Loading properties and bookings for user:", user.user._id);
      loadProperty();
      loadBookings();
    }
  }, [user]);

  // Debugging logs
  useEffect(() => {
    console.log("Properties data updated:", propertiesData);
  }, [propertiesData]);

  useEffect(() => {
    console.log("Bookings data updated:", bookingsData);
  }, [bookingsData]);

  const deleteHandler = async (id) => {
    try {
      await deletePropertyService(id);
      toast.success("Property deleted successfully!");
      loadProperty(); // Refresh properties
    } catch (error) {
      console.error("Error deleting property:", error);
      toast.error("Failed to delete property.");
    }
  };

  const bookingCancelHandler = (id) => {
    console.log(`Cancelled booking with ID: ${id}`);
    // Optional: call API to cancel booking
  };

  return (
    <div className="h-full w-full pt-28 px-20 bg-zinc-50">
      <div className="flex h-full relative w-full gap-8">
        {/* Sidebar */}
        <div className="w-[30vw] p-6 py-10 sticky top-[16vh] bg-white rounded-3xl h-fit shadow-[0px_0px_30px_2px_#e4e4e7] flex flex-col items-center space-y-6">
          <div>
            <div className="flex items-center justify-center w-24 h-24 bg-black text-white text-5xl font-bold rounded-full mx-auto">
              {user.user?.username?.charAt(0).toUpperCase() || "U"}
            </div>

            <div className="text-center mt-4">
              <h2 className="text-4xl text-black font-semibold">
                {user.user?.username || "Guest"}
              </h2>
              <p className="text-gray-500 text-sm">
                {user.user?.isAdmin ? "Admin" : "Guest"}
              </p>
            </div>
          </div>

          <div className="text-center">
            <p className="text-lg font-bold">
              {calculateDuration(user.user?.createdAt)}
            </p>
            <p className="text-gray-500 text-xs">on AuraStay</p>
          </div>

          <div className="text-center space-y-1 text-gray-700 text-sm">
            <p>
              Email: <span className="font-semibold">{user.user?.email}</span>
            </p>
            <p>
              Bookings:{" "}
              <span className="font-semibold">{bookingsData.length}</span>
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full pt-2">
          {/* Properties */}
          <h1 className="text-3xl font-bold mb-4">My properties</h1>
          <div className="grid grid-cols-4 gap-6">
            {propertiesData.length > 0 ? (
              propertiesData.map((property) => (
                <div
                  key={property._id}
                  className="border rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition"
                >
                  <Link to={`/property/${property._id}`}>
                    <div className="w-full h-40 relative overflow-x-auto flex gap-2">
                      {property.images?.map((img, index) => (
                        <img
                          key={index}
                          src={img}
                          alt={property.title}
                          className="w-full h-full object-cover flex-shrink-0"
                        />
                      ))}
                    </div>
                    <div className="p-4">
                      <h2 className="font-semibold text-lg">
                        {property.title}
                      </h2>
                      <p className="text-black font-bold">
                        ₹{property.price} / night
                      </p>
                      <p className="text-gray-500 text-sm">
                        {property.location}
                      </p>
                    </div>
                  </Link>

                  <div className="flex gap-2 px-4">
                    <Link
                      to={`/property/edit/${property._id}`}
                      className="cursor-pointer text-center border border-[#b17f44] text-[#b17f44] rounded-md py-2 w-full"
                    >
                      Edit
                    </Link>
                    <button
                      onClick={() => deleteHandler(property._id)}
                      className="cursor-pointer text-center bg-[#b17f44] text-white rounded-md py-2 w-full"
                      type="button"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p>No properties found.</p>
            )}
          </div>

          {/* Bookings */}
          <h1 className="text-3xl font-bold my-4 mt-10">My Bookings</h1>
          <div className="grid grid-cols-3 gap-x-3">
            {bookingsData.length > 0 ? (
              bookingsData.map((booking) => (
                <div
                  key={booking._id}
                  className="py-5 px-8 mb-2 rounded-xl shadow"
                >
                  <div className="flex items-center justify-between">
                    <h1 className="text-md font-bold">Place</h1>
                    <h1 className="text-sm font-light">
                      {booking.property?.title || "N/A"}
                    </h1>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-bold">Price</h3>
                    <h3 className="text-sm font-light">
                      ₹{booking.totalPrice}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-bold">Status</h3>
                    <h3
                      className={`text-sm font-bold ${
                        booking.status?.toLowerCase() === "confirmed"
                          ? "text-green-600"
                          : booking.status?.toLowerCase() === "pending"
                          ? "text-orange-600"
                          : "text-red-600"
                      }`}
                    >
                      {booking.status || "N/A"}
                    </h3>
                  </div>

                  <div className="flex items-center justify-between">
                    <h3 className="text-md font-bold">Order ID</h3>
                    <h3 className="text-sm font-light">
                      {booking.razorpayOrderId}
                    </h3>
                  </div>

                  <div className="flex justify-between mt-4">
                    <div className="flex flex-col">
                      <h3 className="text-md font-bold">Check In</h3>
                      <h3 className="text-sm font-light">
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
                      <h3 className="text-md font-bold">Check Out</h3>
                      <h3 className="text-sm font-light">
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

                  {booking.status?.toLowerCase() !== "cancelled" && (
                    <button
                      onClick={() => bookingCancelHandler(booking._id)}
                      className="cursor-pointer text-center border-[#b17f44] text-[#b17f44] border rounded-md mt-3 py-2 w-full"
                      type="button"
                    >
                      Cancel Booking
                    </button>
                  )}
                </div>
              ))
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
