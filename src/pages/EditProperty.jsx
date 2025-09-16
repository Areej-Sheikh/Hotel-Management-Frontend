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

  // Fetch property by ID and prefill form
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const res = await viewPropertyService(id);
        const propertyData = res.property; // <-- unwrap here
        console.log("🏠 Fetched property:", propertyData);
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
      // Convert comma-separated strings to arrays
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

      const updatedProperty = await updatePropertyService(processedData);
      console.log("💾 Property updated:", updatedProperty);

      toast.success("Property updated successfully!");
      navigate("/profile"); // redirect back to profile page
    } catch (err) {
      console.error(err);
      toast.error("Failed to update property.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading property...</p>;

  return (
    <div className="flex items-center justify-center w-full h-screen bg-zinc-100">
      <div className="w-[35%] bg-zinc-50 rounded-xl shadow-xl py-1">
        <h1 className="text-center text-lg font-bold py-4">Edit Property</h1>
        <div className="px-5 py-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* Title */}
            <div className="p-4 flex gap-3 border-b border-zinc-500 relative">
              <label>Title:</label>
              <input
                className="w-full focus:outline-none text-xl"
                {...register("title", { required: "Title is required" })}
              />
              {errors.title && (
                <p className="absolute bottom-0 left-[3%] text-xs text-red-500">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="p-4 flex gap-3 border-b border-zinc-500 relative">
              <label>Description:</label>
              <input
                className="w-full focus:outline-none text-xl"
                {...register("description", {
                  required: "Description is required",
                })}
              />
              {errors.description && (
                <p className="absolute bottom-0 left-[3%] text-xs text-red-500">
                  {errors.description.message}
                </p>
              )}
            </div>

            {/* Location */}
            <div className="p-4 flex gap-3 border-b border-zinc-500 relative">
              <label>Location:</label>
              <input
                className="w-full focus:outline-none text-xl"
                {...register("location", { required: "Location is required" })}
              />
              {errors.location && (
                <p className="absolute bottom-0 left-[3%] text-xs text-red-500">
                  {errors.location.message}
                </p>
              )}
            </div>

            {/* Price */}
            <div className="p-4 flex gap-3 border-b border-zinc-500 relative">
              <label>Price (₹ per night):</label>
              <input
                className="w-[65%] focus:outline-none text-xl"
                type="number"
                {...register("price", { required: "Price is required" })}
              />
              {errors.price && (
                <p className="absolute bottom-0 left-[3%] text-xs text-red-500">
                  {errors.price.message}
                </p>
              )}
            </div>

            {/* Amenities */}
            <div className="p-4 flex gap-3 border-b border-zinc-500 relative">
              <label>Amenities:</label>
              <input
                className="w-full focus:outline-none text-xl"
                placeholder="Pool, Wifi, AC"
                {...register("amenities", {
                  required: "Amenities are required",
                })}
              />
              {errors.amenities && (
                <p className="absolute bottom-0 left-[3%] text-xs text-red-500">
                  {errors.amenities.message}
                </p>
              )}
            </div>

            {/* Images */}
            <div className="p-4 flex gap-3 relative">
              <label>Images:</label>
              <input
                className="w-full focus:outline-none text-xl"
                placeholder="Enter image URLs separated by commas"
                {...register("images", { required: "Images are required" })}
              />
              {errors.images && (
                <p className="absolute bottom-0 left-[3%] text-xs text-red-500">
                  {errors.images.message}
                </p>
              )}
            </div>

            <button
              className="w-full bg-[#b17f44] text-white rounded-md py-3 mt-4"
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
