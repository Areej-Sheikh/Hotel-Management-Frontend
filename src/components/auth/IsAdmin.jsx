import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";

const IsAdmin = ({ children }) => {
  const navigate = useNavigate();
  const isAdmin = useSelector((store) => store.user.user?.isAdmin);
  console.log("Is Admin:", isAdmin);

  useEffect(() => {
    if (isAdmin === false) {
      toast.error("Access denied. Admins only.");
      navigate("/");
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return <>{children}</>;
};

export default IsAdmin;
