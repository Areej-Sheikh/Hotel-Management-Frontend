import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const AdminPanel = () => {
  // Get current user info from Redux store
  const { user, isLoggedIn } = useSelector((store) => store.user);

  console.log("AdminPanel user:", user);

  // Sample dynamic navigation items
  const navItems = [
    { label: "Users", path: "/admin-panel/users" },
    { label: "Properties", path: "/admin-panel/properties" },
    { label: "Bookings", path: "/admin-panel/bookings" },
    { label: "Payments", path: "/admin-panel/payments" },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-50   px-20 pt-28 pb-10 relative">
      {/* Sidebar */}
      <aside className="w-[25%] bg-white shadow-xl rounded-xl sticky top-[16vh] h-[80vh] flex flex-col justify-between">
        {/* User Info */}
        <div className="p-4 mt-4 flex items-center border-b">
          <div className="flex-col items-center ">
            <div className="flex items-center justify-center mb-2">
              <div className="flex items-center justify-center w-20 h-20 bg-black text-white text-6xl  font-bold rounded-full">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="mr-9 text-gray-700 font-lg">
                <span className="font-bold">Username: </span>
                {isLoggedIn ? user.username : "Guest User"}
              </p>
              <p className="text-gray-500 text-sm mt-1">
                <span className="font-bold">Email: </span>
                {isLoggedIn ? user.email : "guest@email.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-1 w-full">
          <ul className="w-full flex flex-col gap-1">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "bg-zinc-200 px-4 py-2 w-full rounded"
                    : "w-full px-4 py-2 hover:bg-zinc-100 rounded"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </ul>
        </nav>

        {/* Optional footer stats */}
        {isLoggedIn && (
          <div className="p-4 border-t mt-4">
            <p className="text-sm text-gray-500">
              Role: {user.role || "Admin"}
            </p>
            <p className="text-sm text-gray-500">
              Member Since:{" "}
              {user.createdAt
                ? new Date(user.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })
                : "N/A"}
            </p>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="w-full h-fit">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminPanel;
