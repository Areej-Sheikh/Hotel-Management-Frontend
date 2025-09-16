import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { getUsersService, deleteUserService } from "../../api/adminServices";

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingUserId, setDeletingUserId] = useState(null);

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
      <section className="bg-[#FDF6F0] p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-bold mb-6 flex items-center justify-center text-[#B17F44]">
          All Users
        </h2>

        {users.length === 0 ? (
          <p>No users found.</p>
        ) : (
          <table className="w-full text-left  text-white border-collapse">
            <thead>
              <tr className="text-lg border-b">
                <th className="py-2 text-[#B17F44]">Username</th>
                <th className="py-2 text-[#B17F44]">Email</th>
                <th className="py-2 text-[#B17F44]">Member Since</th>
                <th className="py-2 text-[#B17F44]">Properties</th>
                <th className="py-2 text-[#B17F44]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className="border-t border-b transition-colors hover:bg-[#f9e9db] "
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
                      className={`bg-[#B17F44] text-white rounded-md px-3 py-1 text-sm transition ${
                        deletingUserId === user._id
                          ? "opacity-50 cursor-not-allowed"
                          : "hover:bg-[#9b6b37]"
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
