import { useEffect, useState } from "react";
import Cards from "./partials/Cards";
import Footer from "./partials/Footer";
import { useDispatch } from "react-redux";
import { searchPropertiesAction } from "../store/actions/propertyAction";

const Home = () => {
  const [query] = useState("");

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(searchPropertiesAction(query));
  }, [dispatch, query]);

  return (
    <div className="bg-[#FDF6F0] pt-24 relative w-full h-full">
      <h1 className="text-center mt-10 text-[4.5vw] text-[#333333]">
        Experience the <span className="text-[#B17F44]">Aura</span> <br /> of
        Elegance.
      </h1>
      <Cards />{" "}
      {/* Cards should also have colors applied inside their component */}
      <Footer />{" "}
      {/* Footer should also have colors applied inside its component */}
    </div>
  );
};

export default Home;
