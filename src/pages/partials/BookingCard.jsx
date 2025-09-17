import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const BookingCard = ({ property }) => {
  BookingCard.propTypes = {
    property: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      title: PropTypes.string,
      price: PropTypes.number,
      images: PropTypes.arrayOf(PropTypes.string),
      amenities: PropTypes.arrayOf(PropTypes.string),
      location: PropTypes.string,
      distance: PropTypes.string,
      totalReview: PropTypes.number,
      description: PropTypes.string,
    }).isRequired,
  };

  console.log("Property data:", property);

  const [guests, setGuests] = useState(1);
  const [checkinDate, setCheckinDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [checkoutDate, setCheckoutDate] = useState(
    new Date(new Date().setDate(new Date().getDate() + 2))
      .toISOString()
      .split("T")[0]
  );
  const [nights, setNights] = useState(5);
  const nightRate = property.price;

  useEffect(() => {
    const checkin = new Date(checkinDate);
    const checkout = new Date(checkoutDate);
    const difference = checkout.getTime() - checkin.getTime();
    const totalDays = Math.ceil(difference / (1000 * 60 * 60 * 24));
    setNights(totalDays);
    if (checkinDate === checkoutDate) {
      setNights(1);
    }
  }, [checkinDate, checkoutDate]);

  const totalBeforeTaxes = nightRate * nights * guests;

  return (
    <div className="border p-6 max-w-sm mx-auto shadow-lg rounded-2xl bg-[#fef5ed] sticky top-28">
      {/* Price */}
      <h2 className="text-3xl text-[#333333] font-bold mb-6">
        ₹{nightRate.toLocaleString()}{" "}
        <span className="text-lg text-[#666666] font-medium">/ night</span>
      </h2>

      {/* Date + Guests Section */}
      <div className="border rounded-xl overflow-hidden mb-6">
        <div className="flex justify-between divide-x">
          {/* Check-in */}
          <div className="flex-1 p-3">
            <p className="text-sm font-semibold text-[#333333] mb-1">
              Check-in
            </p>
            <input
              type="date"
              className="w-full text-sm text-gray-600 border rounded-md px-2 py-1 focus:outline-none focus:border-[#B17F44] focus:ring-1 focus:ring-[#B17F44] transition"
              value={checkinDate}
              onChange={(e) => setCheckinDate(e.target.value)}
            />
          </div>

          {/* Checkout */}
          <div className="flex-1 p-3">
            <p className="text-sm font-semibold text-[#333333] mb-1">
              Checkout
            </p>
            <input
              type="date"
              className="w-full text-sm text-gray-600 border rounded-md px-2 py-1 focus:outline-none focus:border-[#B17F44] focus:ring-1 focus:ring-[#B17F44] transition"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
            />
          </div>
        </div>

        {/* Guests */}
        <div className="p-3 border-t">
          <p className="text-sm font-semibold text-[#333333] mb-1">Guests</p>
          <input
            type="number"
            min={1}
            max={999}
            className="w-full text-sm text-gray-600 border rounded-md px-3 py-2 focus:outline-none focus:border-[#B17F44] focus:ring-1 focus:ring-[#B17F44] transition"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
          />
        </div>
      </div>

      {/* Reserve Button */}
      <Link
        to={`/booking/${property._id}?checkinDate=${checkinDate}&checkoutDate=${checkoutDate}&guests=${guests}&nights=${nights}&price=${nightRate}`}
      >
        <button className="bg-[#B17F44] hover:bg-[#9a6b34] text-white font-semibold py-3 px-4 w-full rounded-lg mb-4 shadow-md transition">
          Reserve
        </button>
      </Link>
      <p className="text-sm text-gray-500 text-center mb-6">
        You won’t be charged yet
      </p>

      {/* Price Breakdown */}
      <div className="text-sm space-y-3">
        <div className="flex justify-between text-[#444]">
          <span>
            ₹{nightRate.toLocaleString()} × {nights} nights × {guests} guests
          </span>
          <span>₹{totalBeforeTaxes.toLocaleString()}</span>
        </div>
        <div className="border-t pt-3 flex justify-between text-xl font-bold text-[#B17F44]">
          <span>Total before taxes</span>
          <span>₹{totalBeforeTaxes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
