import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  getPropertiesService,
  deletePropertyService,
} from "../../api/adminServices";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingPropertyId, setDeletingPropertyId] = useState(null);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("Fetching all properties...");
        const data = await getPropertiesService();
        console.log("Properties fetched:", data);

        if (data && data.length > 0) {
          setProperties(data);
          toast.success("Properties loaded successfully!");
        } else {
          toast.info("No properties found.");
        }
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        toast.error(`Failed to fetch properties: ${message}`);
        console.error("Fetch properties error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this property?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingPropertyId(id);
      console.log(`Deleting property with ID: ${id}...`);
      await deletePropertyService(id);

      toast.success("Property deleted successfully!");
      setProperties((prev) => prev.filter((prop) => prop._id !== id));
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to delete property: ${message}`);
      console.error("Delete property error:", error);
    } finally {
      setDeletingPropertyId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-6">
        <section className="bg-white p-6 rounded-lg shadow-md min-h-[80vh] flex items-center justify-center">
          <h2 className="text-lg font-semibold">Loading properties...</h2>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6">
      <section className="bg-[#FDF6F0] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6 flex items-center justify-center text-[#B17F44]">
          All Properties
        </h2>

        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          <table className="w-full text-left border-collapse text-white">
            <thead>
              <tr className="text-lg border-b">
                <th className="py-2 text-[#B17F44]">Title</th>
                <th className="py-2 text-[#B17F44]">Price</th>
                <th className="py-2 text-[#B17F44]">Created By</th>
                <th className="py-2 text-[#B17F44]">Location</th>
                <th className="py-2 text-[#B17F44]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr
                  key={property._id}
                  className="border-t border-b transition-colors hover:bg-[#f9e9db] hover:text-[#FDF6F0]"
                >
                  <td className="py-2">{property.title}</td>
                  <td className="py-2">₹{property.price}</td>
                  <td className="py-2">
                    {property.host?.username || "Unknown"}
                  </td>
                  <td className="py-2">{property.location}</td>
                  <td className="py-2">
                    <button
                      className={`bg-[#B17F44] text-white rounded-md px-3 py-1 text-sm transition ${
                        deletingPropertyId === property._id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#9b6b37]"
                      }`}
                      onClick={() => handleDelete(property._id)}
                      disabled={deletingPropertyId === property._id}
                    >
                      {deletingPropertyId === property._id
                        ? "Deleting..."
                        : "Delete"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
};

export default AllProperties;
