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
    <div className="border p-6 max-w-sm mx-auto shadow-md rounded-lg">
      <h2 className="text-2xl text-[#B17F44] font-bold mb-4">
        ₹{nightRate.toLocaleString()}{" "}
        <span className="text-sm text-[#B17F44]"> per night</span>
      </h2>

      <div className="border rounded-md mb-4">
        <div className="flex justify-between p-2 border-b">
          <div>
            <p className="text-sm font-semibold">Check-in</p>
            <input
              type="date"
              className="text-gray-500"
              value={checkinDate}
              onChange={(e) => setCheckinDate(e.target.value)}
            />
          </div>
          <div>
            <p className="text-sm font-semibold">Checkout</p>
            <input
              type="date"
              className="text-gray-500"
              value={checkoutDate}
              onChange={(e) => setCheckoutDate(e.target.value)}
            />
          </div>
        </div>
        <div className="p-2">
          <p className="text-sm font-semibold">Guests</p>
          <input
            type="number"
            className="text-gray-500 w-full px-2 py-1"
            value={guests}
            onChange={(e) => setGuests(e.target.value)}
            min={1}
            max={999}
          />
        </div>
      </div>

      <Link
        to={`/booking/${property._id}?checkinDate=${checkinDate}&checkoutDate=${checkoutDate}&guests=${guests}&nights=${nights}&price=${nightRate}`}
      >
        <button className="bg-[#b17f44] text-white font-bold py-2 px-4 w-full rounded-lg mb-4">
          Reserve
        </button>
      </Link>
      <p className="text-sm text-gray-500 text-center mb-4">
        You won’t be charged yet
      </p>

      <div className="text-sm">
        <div className="flex justify-between mb-2">
          <span>
            ₹{nightRate.toLocaleString()} x {nights} nights x {guests} guests
          </span>
          <span>₹{totalBeforeTaxes.toLocaleString()}</span>
        </div>
        <div className="flex justify-between font-bold text-[#B17F44] text-xl">
          <span>Total before taxes</span>
          <span>₹{totalBeforeTaxes.toLocaleString()}</span>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;
