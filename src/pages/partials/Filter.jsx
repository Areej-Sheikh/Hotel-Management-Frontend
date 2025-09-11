import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { searchPropertiesAction } from "./../../store/actions/propertyAction";
import PropTypes from "prop-types";

const Filter = ({ display, setDisplay }) => {
  Filter.propTypes = {
    display: PropTypes.bool.isRequired,
    setDisplay: PropTypes.func.isRequired,
  };

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
        className="py-1 w-[35%] bg-zinc-50 rounded-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full py-4 relative border-b border-[#dfdfdf]">
          <div className="absolute left-[3%] top-1/2 -translate-y-1/2">
            <i
              onClick={() => setDisplay(false)}
              className="ri-close-large-line text-zinc-800 cursor-pointer"
            ></i>
          </div>
          <h1 className="text-center font-bold text-lg text-zinc-800">
            Filters
          </h1>
        </div>

        <div className="pt-5 px-5 ">
          <div className="flex flex-col gap-4">
            <h1 className="text-lg font-bold">Location</h1>
            <select
              {...register("location", { required: "Location is required" })}
              className="border p-2 rounded-md w-full"
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

          <div className="flex flex-col gap-4 my-7">
            <h1 className="text-lg font-bold">
              Price Range <span className="text-sm text-zinc-500">(₹)</span>
            </h1>
            <div className="flex gap-4">
              <input
                type="number"
                placeholder="Min (₹)"
                className="border p-2 rounded-md w-full"
                max="99999999"
                min="0"
                {...register("minPrice")}
              />
              <input
                type="number"
                placeholder="Max (₹)"
                className="border p-2 rounded-md w-full"
                max="99999999"
                min="0"
                {...register("maxPrice")}
              />
            </div>

            <button
              onClick={handleSubmit(onSubmit)}
              className="w-full text-center bg-[#b17f44] mt-4 text-white rounded-md py-3"
              type="submit"
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
