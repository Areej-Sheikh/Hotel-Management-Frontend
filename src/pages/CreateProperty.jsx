import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { createPropertyService } from "../api/propertyServices";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const CreateProperty = () => {
  useDispatch();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const formattedData = {
      ...data,
      images: data.images.split(", "),
      amenities: data.amenities.split(", "),
    };

    const res = await createPropertyService(formattedData);
    try {
      if (Object.keys(res).length > 0) {
        toast.success("Property created successfully", res.message);
        navigate("/");
      } else {
        toast.error("Failed to create property");
      }
    } catch (error) {
      toast.error("An error occurred while creating property", error.message);
    }
  };

  return (
    <div className="loginPage flex z-10 top-0 left-0 w-full bg-[#FDF6F0] min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-2xl mt-[10%] bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[#B17F44] py-6 px-8">
          <h1 className="text-center text-2xl font-bold text-white">
            Create Property
          </h1>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Title */}
            <div>
              <label className="block mb-2 font-semibold text-[#333333]">
                Title
              </label>
              <input
                type="text"
                {...register("title", { required: "Title is required" })}
                className="w-full text-[#B17F44] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B17F44] focus:border-[#B17F44]"
              />
              {errors.title && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="block mb-2 font-semibold text-[#333333]">
                Description
              </label>
              <textarea
                {...register("description", {
                  required: "Description is required",
                })}
                className="w-full text-[#B17F44]  px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B17F44] focus:border-[#B17F44]"
                rows={3}
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block mb-2 font-semibold text-[#333333]">
                Location
              </label>
              <input
                type="text"
                {...register("location", { required: "Location is required" })}
                className="w-full text-[#B17F44] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B17F44] focus:border-[#B17F44]"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div>
              <label className="block mb-2 font-semibold text-[#333333]">
                Price (₹ per night)
              </label>
              <input
                type="number"
                {...register("price", { required: "Price is required" })}
                className="w-full text-[#B17F44] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B17F44] focus:border-[#B17F44]"
              />
              {errors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Amenities */}
            <div>
              <label className="block mb-2 font-semibold text-[#333333]">
                Amenities
              </label>
              <input
                type="text"
                {...register("amenities", {
                  required: "Amenities are required",
                })}
                className="w-full px-4 py-3 border text-[#B17F44]   border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B17F44] focus:border-[#B17F44]"
                placeholder="Comma separated amenities"
              />
              {errors.amenities && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.amenities.message}
                </p>
              )}
            </div>

            {/* Images */}
            <div>
              <label className="block mb-2 font-semibold text-[#333333]">
                Image URL
              </label>
              <input
                type="url"
                {...register("images", {
                  required: "Images are required",
                  pattern: {
                    value: /(^\s*(https?:\/\/.*)\s*$)/i,
                    message: "Invalid image URL",
                  },
                })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B17F44] text-[#B17F44] focus:border-[#B17F44]"
              />
              {errors.images && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.images.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#B17F44] text-white font-semibold py-3 rounded-lg shadow-md hover:bg-[#a17039] transition duration-200"
            >
              Create Property
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateProperty;
