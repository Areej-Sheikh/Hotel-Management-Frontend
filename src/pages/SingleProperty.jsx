import Footer from "./partials/Footer";
import BookingCard from "./partials/BookingCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { viewPropertyService } from "./../api/propertyServices";
import { viewReviews } from "./../api/reviewServices";
import { calculateAverageRating } from "../utils/Math";

const SingleProperty = () => {
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState(null);
  const [reviewData, setReviewData] = useState(null);
  const [AverageRating, setAverageRating] = useState(0);

  const getproperty = async (id) => {
    const data = await viewPropertyService(id);
    setPropertyData(data.property);
  };

  const getreviews = async (id) => {
    const res = await viewReviews(id);
    setReviewData(res);
    res.length > 0 &&
      setAverageRating(calculateAverageRating(res.map((r) => r.rating)));
  };

  useEffect(() => {
    getproperty(id);
    getreviews(id);
  }, [id]);

  const ratings = [
    { label: "Cleanliness", value: "5.0", icon: "ri-sparkling-line" },
    { label: "Accuracy", value: "5.0", icon: "ri-checkbox-circle-line" },
    { label: "Check-in", value: "5.0", icon: "ri-key-line" },
    { label: "Communication", value: "4.9", icon: "ri-chat-4-line" },
    { label: "Location", value: "5.0", icon: "ri-map-pin-line" },
    { label: "Value", value: "4.9", icon: "ri-price-tag-3-line" },
  ];

  return (
    propertyData && (
      <>
        <div className="h-full w-full bg-[#FDF6F0] pt-28 px-40">
          <div className="flex w-full gap-2 h-[60vh] rounded-2xl overflow-hidden">
            <div className="w-1/2 h-full relative">
              <div className="w-full h-full absolute top-0 left-0 hover:bg-[#B17F44]/20 cursor-pointer duration-[.2s]"></div>
              <img
                src={propertyData.images[0]}
                alt=""
                className="w-full h-full object-cover"
              />
            </div>
            <div className="w-1/2 h-full flex flex-col gap-2">
              <div className="w-full h-1/2 flex gap-2">
                <div className="w-1/2 h-full relative">
                  <div className="w-full h-full absolute top-0 left-0 hover:bg-[#B17F44]/20 cursor-pointer duration-[.2s]"></div>
                  <img
                    src={propertyData.images[1]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-1/2 h-full relative">
                  <div className="w-full h-full absolute top-0 left-0 hover:bg-[#B17F44]/20 cursor-pointer duration-[.2s]"></div>
                  <img
                    src={propertyData.images[2]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="w-full h-1/2 flex gap-2">
                <div className="w-1/2 h-full relative">
                  <div className="w-full h-full absolute top-0 left-0 hover:bg-[#B17F44]/20 cursor-pointer duration-[.2s]"></div>
                  <img
                    src={propertyData.images[3]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-1/2 h-full relative">
                  <div className="w-full h-full absolute top-0 left-0 hover:bg-[#B17F44]/20 cursor-pointer duration-[.2s]"></div>
                  <img
                    src={propertyData.images[4]}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-between w-full px-2 items-end mb-4">
            <div className="w-[50%]">
              <div className="flex justify-between items-start w-full">
                <h1 className="text-4xl text-[#333333] font-bold">
                  {propertyData.title}
                </h1>
              </div>
              <div className="flex justify-between items-center w-full">
                <div className="my-6">
                  <h1 className="text-3xl text-[#B17F44]">
                    {propertyData.location}
                  </h1>
                  <h1 className="text-lg text-[#666666]">
                    {propertyData.distance}
                  </h1>
                </div>
                <div className="my-6 h-full w-[20%] flex items-center justify-between">
                  <div>
                    <h3 className="flex relative">
                      <i className="ri-star-fill text-5xl text-[#B17F44]"></i>
                      <p className="absolute text-xs font-bold text-[#FDF6F0] top-[55%] left-1/2 -translate-x-1/2 -translate-y-1/2">
                        {AverageRating}
                      </p>
                    </h3>
                  </div>
                  <div className="h-[40px] bg-[#666666] w-[1px]"></div>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-[#B17F44]">
                      {propertyData.totalReview}
                    </h3>
                    <p className="text-xs underline text-[#666666]">Reviews</p>
                  </div>
                </div>
              </div>

              <div className="text-[#666666]">{propertyData.description}</div>

              <div className="amenities w-full mt-2">
                <h1 className="text-2xl text-[#B17F44]">
                  What this place offers
                </h1>
                <div className="grid grid-cols-2 gap-4 p-4 text-md">
                  {propertyData.amenities.slice(0, 10).map((amenity, index) => (
                    <h4 key={index} className="col-span-1 text-[#333333]">
                      ~ {amenity}
                    </h4>
                  ))}
                  {propertyData.amenities.length > 10 ? (
                    <button
                      className="text-center mt-4 text-[#B17F44] border-[#B17F44] border rounded-md py-3"
                      type="submit"
                    >
                      Show all {propertyData.amenities.length} amenities
                    </button>
                  ) : null}
                </div>
              </div>
            </div>

            <div className="w-fit mb-4">
              <BookingCard property={propertyData} />
            </div>
          </div>

          <div className="mx-auto py-4 relative">
            <div className="text-center mb-8">
              <div className="flex items-start justify-center">
                <img
                  className="h-32"
                  src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/78b7687c-5acf-4ef8-a5ea-eda732ae3b2f.png"
                  alt=""
                />
                <h1 className="text-8xl text-[#B17F44] font-bold">
                  {propertyData.avaerageRating}
                </h1>
                <img
                  className="h-32"
                  src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-GuestFavorite/original/b4005b30-79ff-4287-860c-67829ecd7412.png"
                  alt=""
                />
              </div>
              <p className="text-2xl text-[#B17F44] font-bold">
                Guest favourite
              </p>
              <p className="text-[#666666] text-lg w-[30%] text-center mx-auto">
                One of the most loved homes on Airbnb based on ratings, reviews
                and reliability
              </p>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-8">
              {ratings.map((rating) => (
                <div key={rating.label} className="text-center">
                  <p className="text-xl font-semibold text-[#B17F44]">
                    {rating.value}
                  </p>
                  <div className="flex justify-center items-center mt-1">
                    <i className={`${rating.icon} text-2xl text-[#B17F44]`} />
                  </div>
                  <p className="text-sm text-[#666666]">{rating.label}</p>
                </div>
              ))}
            </div>

            <div className="border-t pt-6 grid grid-cols-2 gap-4">
              {reviewData?.length > 0 &&
                reviewData.slice(0, 6).map((review, index) => (
                  <div key={index} className="mb-6">
                    <div className="flex items-center mb-2">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="w-12 h-12 rounded-full mr-3"
                      />
                      <div>
                        <h3 className="font-semibold text-[#B17F44]">
                          {review.name}
                        </h3>
                        <p className="text-sm text-[#666666]">
                          {review.timeOnAirbnb} years on Airbnb
                        </p>
                      </div>
                    </div>
                    <p className="text-sm text-[#666666] mb-1">
                      ⭐️⭐️⭐️⭐️⭐️ {review.date} - Stayed a few nights
                    </p>
                    <p className="text-[#333333]">{review.comment}</p>
                  </div>
                ))}
              {reviewData?.length > 6 ? (
                <button
                  className="text-center text-[#B17F44] font-bold border-[#B17F44] border rounded-md py-3 w-fit px-10"
                  type="submit"
                >
                  Show all {reviewData.length} reviews
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <Footer />
      </>
    )
  );
};

export default SingleProperty;
