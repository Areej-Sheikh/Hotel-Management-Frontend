import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsersService, deleteUserService } from "../../api/adminServices";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);

  // Fetch all non-admin users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        console.log("Fetching all users...");
        const usersData = await getUsersService();
        console.log("Users fetched:", usersData);
        setUsers(usersData || []);
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        toast.error(`Failed to fetch users: ${message}`);
        console.error("Fetch users error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Delete user
  const handleRemove = async (userId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to remove this user?"
    );
    if (!confirmDelete) return;

    try {
      setDeletingUserId(userId);
      console.log(`Removing user with ID: ${userId}...`);

      await deleteUserService(userId);

      toast.success("User removed successfully");
      setUsers((prev) => prev.filter((user) => user._id !== userId));
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      toast.error(`Failed to remove user: ${message}`);
      console.error("Remove user error:", error);
    } finally {
      setDeletingUserId(null);
    }
  };

  if (loading) {
    return (
      <main className="flex-1 px-6">
        <section className="bg-white p-6 rounded-lg shadow-md min-h-[80vh] flex items-center justify-center">
          <h2 className="text-lg font-semibold">Loading users...</h2>
        </section>
      </main>
    );
  }

  return (
    <main className="flex-1 px-6">
      <section className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-4">All Users</h2>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-xl border-b">
                <th className="py-2">Username</th>
                <th className="py-2">Email</th>
                <th className="py-2">Member Since</th>
                <th className="py-2">Properties</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-b hover:bg-gray-100"
                >
                  <td className="py-2">{user.username}</td>
                  <td className="py-2">{user.email}</td>
                  <td className="py-2">
                    {new Date(user.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </td>
                  <td className="py-2">{user.properties?.length || 0}</td>
                  <td className="py-2">
                    <button
                      className={`bg-[#b17f44] text-white rounded-md px-3 py-1 text-sm ${
                        deletingUserId === user._id
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={() => handleRemove(user._id)}
                      disabled={deletingUserId === user._id}
                    >
                      {deletingUserId === user._id ? "Removing..." : "Remove"}
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

export default AllUser;
