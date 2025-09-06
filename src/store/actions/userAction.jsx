// import { renderIntoDocument } from "react-dom/test-utils";
import {
  currentUserService,
  loginService,
  logoutService,
  signupService,
} from "../../api/userServices";
import { login, logout } from "../reducers/userSlice";

export const asynccurrentuser = () => async (dispatch) => {
  const user = await currentUserService();
  dispatch(login(user));
  !user && dispatch(logout());
};

export const asyncsignup = (user) => async (dispatch) => {
  await signupService(user);
  dispatch(asynccurrentuser());
};

export const asynclogin = (user) => async (dispatch) => {
  const data = await loginService(user);
  dispatch(asynccurrentuser());
  return data;
};

export const asynclogout = () => async (dispatch) => {
  await logoutService();
  dispatch(logout());
};
