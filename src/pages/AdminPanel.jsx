import { useSelector } from "react-redux";
import { NavLink, Outlet } from "react-router-dom";

const AdminPanel = () => {
  const { user, isLoggedIn } = useSelector((store) => store.user);

  const navItems = [
    { label: "Users", path: "/admin-panel/users" },
    { label: "Properties", path: "/admin-panel/properties" },
    { label: "Bookings", path: "/admin-panel/bookings" },
    { label: "Payments", path: "/admin-panel/payments" },
  ];

  return (
    <div className="min-h-screen flex bg-zinc-50 px-20 pt-28 pb-10 relative">
      {/* Sidebar */}
      <aside className="w-[25%] bg-[#FDF6F0] shadow-xl rounded-xl sticky top-[16vh] h-[80vh] flex flex-col justify-between">
        {/* User Info */}
        <div className="p-4 mt-4 flex items-center border-b">
          <div className="flex flex-col items-center w-full">
            <div className="flex items-center justify-center mb-2">
              <div className="w-20 h-20 bg-[#B17F44] text-white text-6xl font-bold rounded-full flex items-center justify-center ">
                {user.username?.charAt(0).toUpperCase() || "U"}
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-[#B17F44] font-medium">
                <span className="font-bold">Username: </span>
                {isLoggedIn ? user.username : "Guest User"}
              </p>
              <p className="text-[#B17F44] text-sm mt-1">
                <span className="font-bold">Email: </span>
                {isLoggedIn ? user.email : "guest@email.com"}
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-1 w-full">
          <ul className="flex flex-col gap-1 w-full">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "bg-[#B17F44] text-[#FDF6F0] px-4 py-2 w-full rounded font-medium"
                    : "w-full px-4 py-2 hover:bg-[#FDF6F0] rounded font-medium"
                }
              >
                {item.label}
              </NavLink>
            ))}
          </ul>
        </nav>

        {/* Optional footer stats */}
        {isLoggedIn && (
          <div className="p-4 border-t mt-4 text-gray-500 text-sm">
            <p>Role: {user.role || "Admin"}</p>
            <p>
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
      <main className="w-full h-fit pl-8">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminPanel;
