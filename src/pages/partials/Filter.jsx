import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { searchPropertiesAction } from "./../../store/actions/propertyAction";
import PropTypes from "prop-types";

const Filter = ({ display, setDisplay }) => {
  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch();
  const properties = useSelector((store) => store.property.properties);
  const locations = [...new Set(properties.map((item) => item.location))];

  const onSubmit = (data) => {
    if (Number(data.minPrice) > Number(data.maxPrice)) {
      alert("Min price cannot be greater than Max price");
      return;
    }
    const query = `?location=${data.location}&minPrice=${data.minPrice}&maxPrice=${data.maxPrice}`;
    dispatch(searchPropertiesAction(query));
    setDisplay(false);
  };

  if (!display) return null;

  return (
    <div
      className="filterPage flex fixed z-[2] top-0 left-0 w-full bg-zinc-800/[.4] h-screen items-center justify-center"
      onClick={() => setDisplay(false)}
    >
      <div
        className="py-1 w-[35%] max-w-md sm:w-[80%] bg-zinc-50 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full py-4 relative border-b border-[#B17F44]/50">
          <div className="absolute left-[3%] top-1/2 -translate-y-1/2">
            <i
              onClick={() => setDisplay(false)}
              aria-label="Close filter"
              className="ri-close-large-line text-zinc-800 cursor-pointer"
            />
          </div>
          <h1 className="text-center font-bold text-lg text-[#B17F44]">
            Filters
          </h1>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="pt-5 px-5 flex flex-col gap-7"
        >
          {/* Location */}
          <div className="flex flex-col gap-2">
            <h1 className="text-lg font-bold  text-[#B17F44]">Location</h1>
            <select
              {...register("location", { required: "Location is required" })}
              className="border border-[#B17F44]/50 p-2 rounded-md w-full"
              defaultValue=""
            >
              <option value="" disabled>
                Select Location
              </option>
              {locations.map((location, index) => (
                <option key={index} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="flex flex-col gap-2">
            <h1 className="text-lg text-[#B17F44] font-bold">
              Price Range <span className="text-sm text-[#B17F44]">(₹)</span>
            </h1>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Min (₹)"
                className="border  text-[#B17F44] border-[#B17F44]/50 p-2 rounded-md w-full"
                max="99999999"
                min="0"
                {...register("minPrice")}
              />
              <input
                type="number"
                placeholder="Max (₹)"
                className="border  text-[#B17F44] border-[#B17F44]/50 p-2 rounded-md w-full"
                max="99999999"
                min="0"
                {...register("maxPrice")}
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#B17F44] hover:bg-[#a06c3a] text-white rounded-md mb-3 py-3 transition"
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
};

Filter.propTypes = {
  display: PropTypes.bool.isRequired,
  setDisplay: PropTypes.func.isRequired,
};

export default Filter;
