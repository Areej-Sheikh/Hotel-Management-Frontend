import { toast } from "react-toastify";
import {
  fetchPropertiesFailure,
  fetchPropertiesStart,
  fetchPropertiesSuccess,
} from "../reducers/propertySlice";
import { searchPropertyService } from "../../api/propertyServices";

export const searchPropertiesAction = (query) => async (dispatch) => {
  try {
    dispatch(fetchPropertiesStart());
    const data = await searchPropertyService(query);
    dispatch(fetchPropertiesSuccess(data));
  } catch (error) {
    toast.error(error.response?.data?.message || "Something went wrong");
    dispatch(fetchPropertiesFailure(error.response?.data?.message || "Error"));
  }
};

