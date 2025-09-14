import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotFound from "./../../pages/partials/NotFound";
import { useEffect } from "react";

const ProtectedRoute = ({ children }) => {
  const navigate = useNavigate();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  console.log(isLoggedIn);
  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, navigate]);

  return isLoggedIn ? children : <NotFound />;
};

export default ProtectedRoute;
