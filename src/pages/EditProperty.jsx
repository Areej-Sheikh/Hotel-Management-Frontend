import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  updatePropertyService,
  viewPropertyService,
} from "../api/propertyServices";

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await viewPropertyService(id);
        const propertyData = res.property;
        if (!propertyData) throw new Error("Property not found");

        reset({
          title: propertyData.title || "",
          description: propertyData.description || "",
          location: propertyData.location || "",
          price: propertyData.price || "",
          amenities: (propertyData.amenities || []).join(", "),
          images: (propertyData.images || []).join(", "),
        });
      } catch (err) {
        console.error(err);
        toast.error("Failed to load property data.");
      } finally {
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id, reset]);

  const onSubmit = async (data) => {
    try {
      const processedData = {
        _id: id,
        ...data,
        amenities: data.amenities
          .split(",")
          .map((a) => a.trim())
          .filter(Boolean),
        images: data.images
          .split(",")
          .map((i) => i.trim())
          .filter(Boolean),
      };

      await updatePropertyService(processedData);
      toast.success("Property updated successfully!");
      navigate("/profile");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update property.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading property...</p>;

  return (
    <div className="loginPage flex z-[2] top-0 left-0 w-full bg-[#FDF6F0] h-screen items-center justify-center">
      <div className="py-1 w-[35%] bg-[#FDF6F0] rounded-xl mt-[9%] shadow-xl">
        <div className="w-full py-4 relative">
          <div className="absolute left-[3%] top-1/2 translate-y-[-50%]"></div>
          <h1 className="text-center font-bold text-lg text-[#B17F44]">
            Edit Property
          </h1>
        </div>

        <div className="py-5 px-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full border border-zinc-500 rounded-lg">
              {/* Title */}
              <div className="w-full p-4 text-md relative flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Title:</label>
                <input
                  className="w-full h-full bg-[#FDF6F0] text-[#B17F44] focus:outline-none text-xl"
                  type="text"
                  {...register("title", { required: "Title is required" })}
                />
                {errors.title && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.title.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Description:</label>
                <input
                  className="w-full h-full bg-[#FDF6F0] text-[#B17F44] focus:outline-none text-xl"
                  type="text"
                  {...register("description", {
                    required: "Description is required",
                  })}
                />
                {errors.description && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.description.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Location:</label>
                <input
                  className="w-full h-full bg-[#FDF6F0] text-[#B17F44] focus:outline-none text-xl"
                  type="text"
                  {...register("location", {
                    required: "Location is required",
                  })}
                />
                {errors.location && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Price (₹ per night):</label>
                <input
                  className="w-[65%] h-full bg-[#FDF6F0] text-[#B17F44] focus:outline-none text-xl"
                  type="number"
                  {...register("price", { required: "Price is required" })}
                />
                {errors.price && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.price.message}
                  </p>
                )}
              </div>

              {/* Amenities */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3 border-b border-zinc-500">
                <label>Amenities:</label>
                <input
                  className="w-full h-full bg-[#FDF6F0] text-[#B17F44] focus:outline-none text-xl"
                  placeholder="Pool, Wifi, AC"
                  {...register("amenities", {
                    required: "Amenities are required",
                  })}
                />
                {errors.amenities && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.amenities.message}
                  </p>
                )}
              </div>

              {/* Images */}
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3">
                <label>Images:</label>
                <input
                  className="w-full h-full bg-[#FDF6F0] text-[#B17F44] focus:outline-none text-xl"
                  placeholder="Enter image URLs separated by commas"
                  {...register("images", {
                    required: "Images are required",
                    pattern: {
                      value: /(^\s*(https?:\/\/.*)\s*$)/i,
                      message: "Invalid image URL",
                    },
                  })}
                />
                {errors.images && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[red] text-xs">
                    <i className="ri-information-fill text-[red]"></i>{" "}
                    {errors.images.message}
                  </p>
                )}
              </div>
            </div>

            <button
              className="w-full text-center bg-[#B17F44] mt-4 text-white rounded-md py-3"
              type="submit"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
