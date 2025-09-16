import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../api/axiosConfig.jsx";
import { getAllBookingsService } from "../../api/bookingServices";
const AllBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAllBookingsService();

        // For each booking, populate user + property details
        const populatedBookings = await Promise.all(
          data.map(async (booking) => {
            try {
              const [userRes, propertyRes] = await Promise.all([
                axios.get(`/users/${booking.user}`), // get user by ID
                axios.get(`/properties/${booking.property}`), // get property by ID
              ]);

              return {
                ...booking,
                user: userRes.data.username, // replace ID with username
                property: propertyRes.data.name, // replace ID with property name
              };
            } catch (err) {
              console.error("Error populating booking:", err);
              return booking; // fallback to IDs
            }
          })
        );

        setBookings(populatedBookings);
      } catch (error) {
        toast.error("Failed to fetch bookings");
        console.log(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

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
      <section className="bg-white p-6 rounded-lg shadow-md min-h-[80vh]">
        <h2 className="text-xl font-bold mb-4">Bookings</h2>
        {bookings.length === 0 ? (
          <p>No bookings found.</p>
        ) : (
          <div className="grid grid-cols-3 gap-x-3">
            {bookings.map((booking) => (
              <div
                key={booking._id}
                className="py-5 px-8 mb-2 rounded-xl shadow-[0px_0px_30px_2px_#e4e4e7]"
              >
                <div className="flex items-center w-full justify-between">
                  <h1 className="text-md font-bold">Place </h1>
                  <h1 className="text-sm font-light">{booking.property}</h1>
                </div>

                <div className="flex items-center w-full justify-between">
                  <h1 className="text-md font-bold">Booked by </h1>
                  <h1 className="text-sm font-light">{booking.user}</h1>
                </div>

                <div className="flex items-center w-full justify-between">
                  <h3 className="text-md font-bold">Price </h3>
                  <h3 className="text-sm font-light">₹{booking.totalPrice}</h3>
                </div>

                <div className="flex items-center w-full justify-between">
                  <h3 className="text-md font-bold">Status </h3>
                  <h3
                    className={`text-sm ${
                      booking.status.toLowerCase() === "confirmed" &&
                      "text-green-600"
                    } ${
                      booking.status.toLowerCase() === "pending" &&
                      "text-orange-600"
                    } ${
                      booking.status.toLowerCase() === "cancelled" &&
                      "text-red-600"
                    } font-bold`}
                  >
                    {booking.status}
                  </h3>
                </div>

                <div className="flex items-center w-full justify-between">
                  <h3 className="text-md font-bold">Order ID </h3>
                  <h3 className="text-sm font-light">
                    {booking.razorpayOrderId}
                  </h3>
                </div>

                <div className="flex justify-between items-center mt-4">
                  <div className="flex flex-col w-full justify-between">
                    <h3 className="text-md font-bold">Check In </h3>
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
                  <div className="flex items-end flex-col w-full justify-between">
                    <h3 className="text-md font-bold">Check Out </h3>
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
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default AllBookings;
