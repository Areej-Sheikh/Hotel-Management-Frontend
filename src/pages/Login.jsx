import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";
import { asynclogin } from "../store/actions/userAction";
import { toast } from "react-toastify";

const Login = ({ display, setDisplay }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  Login.propTypes = {
    display: PropTypes.bool.isRequired,
    setDisplay: PropTypes.func.isRequired,
  };
  const user = useSelector((store) => store.user);
  console.log(user);

  const dispatch = useDispatch();
  const onSubmit = async (data) => {
    const userData = await dispatch(asynclogin(data));
    userData && toast.success("Login success");
    setDisplay(false);
  };

  if (!display) return null;

  return (
    <div className="loginPage flex fixed z-[2] top-0 left-0 w-full bg-zinc-800/[.4] h-screen items-center justify-center">
      <div className="py-1 w-[35%] bg-[#FDF6F0] rounded-xl">
        <div className="w-full py-4 relative border-b border-[#dfdfdf]">
          <div className="absolute left-[3%] top-1/2 -translate-y-1/2">
            <i
              onClick={() => setDisplay(false)}
              className="ri-close-large-line text-[#333333] cursor-pointer"
            ></i>
          </div>
          <h1 className="text-center font-bold text-xl text-[#B17F44]">
            Log In
          </h1>
        </div>

        <div className="py-5 px-5">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="w-full border border-[#666666] rounded-lg">
              <div className="w-full p-4 text-md relative flex justify-center items-center gap-3 border-b border-[#666666]">
                <label className="text-[#333333]">Email:</label>
                <input
                  className="w-full h-full bg-[#FDF6F0] focus:outline-none text-xl text-[#B17F44]"
                  type="email"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[#E74C3C] text-xs flex items-center gap-1">
                    <i className="ri-information-fill text-[#E74C3C]"></i>
                    {errors.email.message}
                  </p>
                )}
              </div>
              <div className="p-4 text-md relative w-full flex justify-center items-center gap-3">
                <label className="text-[#333333]">Password:</label>
                <input
                  className="w-full h-full bg-[#FDF6F0] focus:outline-none text-xl text-[#B17F44]"
                  type="password"
                  {...register("password", {
                    required: "Password is required",
                  })}
                />
                {errors.password && (
                  <p className="absolute bottom-0 left-[3%] w-full text-[#E74C3C] text-xs flex items-center gap-1">
                    <i className="ri-information-fill text-[#E74C3C]"></i>
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>
            <button
              className="w-full text-center bg-[#B17F44] hover:bg-[#B17F44]/20 mt-4 text-white rounded-md py-3 transition-colors duration-200"
              type="submit"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
