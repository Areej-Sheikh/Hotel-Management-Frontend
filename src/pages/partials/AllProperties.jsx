import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "../../api/axiosConfig.jsx";

const AllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingPropertyId, setDeletingPropertyId] = useState(null); // track property being deleted

  // Fetch properties on mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log("Fetching all properties...");
        const { data } = await axios.get("/properties"); // backend endpoint
        console.log("Properties fetched:", data);
        setProperties(data);
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

  // Remove property handler
  const handleRemove = async (propertyId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this property?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingPropertyId(propertyId); // disable button
      console.log(`Removing property with ID: ${propertyId}...`);
      await axios.delete(`/properties/${propertyId}`);
      toast.success("Property removed successfully");
      console.log("Property removed:", propertyId);
      setProperties((prev) =>
        prev.filter((property) => property._id !== propertyId)
      );
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to remove property: ${message}`);
      console.error("Remove property error:", error);
    } finally {
      setDeletingPropertyId(null);
    }
  };

  // Loading state
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
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">Properties</h2>

        {properties.length === 0 ? (
          <p>No properties found.</p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-xl">
                <th>Title</th>
                <th>Price</th>
                <th>Existing Since</th>
                <th>Location</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {properties.map((property) => (
                <tr key={property._id} className="border-t">
                  <td>{property.title}</td>
                  <td>₹{property.price}</td>
                  <td>
                    {new Date(property.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td>{property.location}</td>
                  <td className="flex gap-4">
                    <button
                      className="w-full text-center border border-[#b17f44] text-[#b17f44] rounded-md py-2 mb-2 text-sm"
                      type="button"
                    >
                      View
                    </button>
                    <button
                      className={`w-full text-center bg-[#b17f44] text-white rounded-md py-2 mb-2 text-sm ${
                        deletingPropertyId === property._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      type="button"
                      onClick={() => handleRemove(property._id)}
                      disabled={deletingPropertyId === property._id}
                    >
                      {deletingPropertyId === property._id
                        ? "Removing..."
                        : "Remove"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Optional dashboard widgets */}
      <section className="grid grid-cols-2 gap-6 mt-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Productivity</h2>
          <div>
            <div className="h-32 bg-gray-200 flex items-center justify-center">
              Chart Placeholder
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Projects in Progress</h2>
          <ul>
            <li className="mb-2">
              <p className="text-sm text-gray-600">Improve card readability</p>
              <div className="flex items-center text-sm text-gray-500">
                <span>12 comments</span>
                <span className="ml-4">7 files</span>
              </div>
            </li>
          </ul>
        </div>
      </section>
    </main>
  );
};

export default AllProperties;
