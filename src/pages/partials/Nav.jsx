import { useEffect, useState } from "react";
import Filter from "./Filter";
import Login from "../Login";
import Signup from "../Signup";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { asynclogout } from "../../store/actions/userAction";
import { toast } from "react-toastify";

const Nav = () => {
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isLoginVisible, setIsLoginVisible] = useState(false);
  const [isSignupVisible, setIsSignupVisible] = useState(false);
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  const filterHandler = () => setIsFilterVisible(!isFilterVisible);
  const loginHandler = () => setIsLoginVisible(!isLoginVisible);
  const signupHandler = () => setIsSignupVisible(!isSignupVisible);
  const dispatch = useDispatch();
  const logoutHandler = async () => {
    await dispatch(asynclogout());
    toast.success("Logged out successfully");
  };
  const toggleMenu = () => setIsMenuVisible(!isMenuVisible);

  const isAdmin = useSelector((store) => store.user.user?.isAdmin);
  const { isLoggedIn } = useSelector((store) => store.user);
  const { pathname } = useLocation();

  useEffect(() => {
    const handleOutsideClick = (e) => {
      const menu = document.querySelector(".menu");
      const handler = document.querySelector(".menu-handler");
      if (
        menu &&
        handler &&
        !menu.contains(e.target) &&
        !handler.contains(e.target)
      ) {
        setIsMenuVisible(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  return (
    <>
      <nav className="fixed top-0 w-full z-[1]">
        <div className="nav-p1 w-full px-20 flex justify-between items-center border-b border-[#B17F44] bg-[#B17F44] ">
          <Link to={"/"} className="logo h-24  bg-[#FDF6F0] rounded-full">
            <img
              draggable="false"
              className="h-full object-cover "
              src="/images/logo.png"
              alt="Logo"
            />
          </Link>

          <div className="flex gap-8 w-fit items-center">
            {isLoggedIn && (
              <Link
                to={"/property/create"}
                className="text-lg font-semibold text-[#FDF6F0] "
              >
                Add your property
              </Link>
            )}

            {isAdmin && (
              <Link
                to={"/admin-panel/users"}
                className=" text-lg font-semibold text-[#FDF6F0] "
              >
                Admin panel
              </Link>
            )}

            <div>
              <i className="ri-global-line text-2xl text-[#FDF6F0]"></i>
            </div>

            {pathname === "/" && (
              <div
                onClick={filterHandler}
                className="py-2 px-5 border border-[#FDF6F0] rounded-lg text-[#FDF6F0] cursor-pointer hover:bg-[#B17F44]/20 transition"
              >
                Filters
              </div>
            )}

            <div
              onClick={toggleMenu}
              className="flex cursor-pointer relative items-center border border-[#FDF6F0] py-1 px-3 rounded-full gap-3 menu-handler"
            >
              <i className="ri-menu-line text-2xl font-medium text-[#FDF6F0]"></i>
              <div className="bg-[#FDF6F0] h-8 aspect-square flex items-end justify-center rounded-full">
                <div className="rounded-full text-white text-lg overflow-hidden">
                  <i className="ri-user-3-fill text-2xl text-[#B17F44]"></i>
                </div>
              </div>

              <div
                className={`menu absolute ${
                  isMenuVisible ? "block" : "hidden"
                } top-[110%] w-[280%] shadow-[0_4px_20px_3px_rgba(0,0,0,0.1)] overflow-hidden z-[2] right-0 bg-[#FDF6F0] rounded-xl`}
              >
                {isLoggedIn && (
                  <Link to={"/profile"}>
                    <h3 className=" text-medium font-semibold px-4 text-[#B17F44] hover:bg-[#B17F44]/20 cursor-pointer transition-all py-6">
                      My Profile
                    </h3>
                  </Link>
                )}
                {!isLoggedIn && (
                  <>
                    <h3
                      onClick={signupHandler}
                      className=" text-medium font-semibold px-4 text-[#B17F44] hover:bg-[#B17F44]/20 cursor-pointer transition-all py-6"
                    >
                      Sign up
                    </h3>
                    <h3
                      onClick={loginHandler}
                      className=" text-medium font-semibold px-4 text-[#B17F44] hover:bg-[#B17F44]/20 cursor-pointer transition-all py-6 border-b border-[#B17F44]"
                    >
                      Log in
                    </h3>
                  </>
                )}

                {isLoggedIn && (
                  <h3
                    onClick={logoutHandler}
                    className=" text-medium font-semibold px-4 text-[#B17F44] hover:bg-[#B17F44]/20 cursor-pointer transition-all py-6"
                  >
                    Logout
                  </h3>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {isFilterVisible && (
        <Filter display={isFilterVisible} setDisplay={setIsFilterVisible} />
      )}
      {isLoginVisible && (
        <Login display={isLoginVisible} setDisplay={setIsLoginVisible} />
      )}
      {isSignupVisible && (
        <Signup display={isSignupVisible} setDisplay={setIsSignupVisible} />
      )}
    </>
  );
};

export default Nav;
