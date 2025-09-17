import Footer from "./partials/Footer";
import BookingCard from "./partials/BookingCard";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { viewPropertyService } from "./../api/propertyServices";
import {
  viewReviews,
  addReview,
  updateReview,
  deleteReview,
} from "./../api/reviewServices";
import { calculateAverageRating } from "../utils/Math";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";

const SingleProperty = () => {
  const { id } = useParams();
  const currentUser = useSelector((store) => store.user);
  console.log("Current logged-in user in SingleProperty:", currentUser);

  const [propertyData, setPropertyData] = useState(null);
  const [reviewData, setReviewData] = useState([]);
  const [AverageRating, setAverageRating] = useState(0);
  const [openMenuReviewId, setOpenMenuReviewId] = useState(null);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [newReview, setNewReview] = useState({ rating: "", comment: "" });

  const [hasReviewed, setHasReviewed] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [editData, setEditData] = useState({ rating: "", comment: "" });

  const [showAllReviews, setShowAllReviews] = useState(false);

  const getproperty = async (id) => {
    const data = await viewPropertyService(id);
    console.log("Property API response:", data);
    setPropertyData(data.property);
  };

  const getreviews = async (id) => {
    const res = await viewReviews(id);
    console.log("Reviews API response:", res);
    if (Array.isArray(res)) {
      setReviewData(res);
      if (res.length > 0) {
        setAverageRating(calculateAverageRating(res.map((r) => r.rating)));
      }
    } else {
      setReviewData([]);
    }
  };

  useEffect(() => {
    getproperty(id);
    getreviews(id);
  }, [id]);

  useEffect(() => {
    if (reviewData && currentUser?.user) {
      const userHasReviewed = reviewData.some(
        (review) => review.user._id === currentUser.user._id
      );
      console.log("User has already reviewed?", userHasReviewed);
      setHasReviewed(userHasReviewed);
    }
  }, [reviewData, currentUser]);

  const ratings = [
    { label: "Cleanliness", value: "5.0", icon: "ri-sparkling-line" },
    { label: "Accuracy", value: "5.0", icon: "ri-checkbox-circle-line" },
    { label: "Check-in", value: "5.0", icon: "ri-key-line" },
    { label: "Communication", value: "4.9", icon: "ri-chat-4-line" },
    { label: "Location", value: "5.0", icon: "ri-map-pin-line" },
    { label: "Value", value: "4.9", icon: "ri-price-tag-3-line" },
  ];

  const handleReviewSubmit = async (e) => {
    e.preventDefault();

    if (hasReviewed) {
      toast.info("You have already reviewed this property ✅");
      return; // Prevent submitting again
    }

    try {
      const payload = {
        propertyId: id,
        rating: newReview.rating,
        comment: newReview.comment,
      };

      console.log("Submitting review payload:", payload);

      const res = await addReview(payload);

      if (res) {
        toast.success("Your review has been successfully submitted 🎉");
        await getreviews(id);
        setShowReviewForm(false);
        setNewReview({ rating: "", comment: "" });
      }
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error(
        err?.error || "Something went wrong while adding the review ❌"
      );
    }
  };

  const handleEditClick = (review) => {
    console.log("Editing review:", review);
    setEditingReview(review._id);
    setEditData({ rating: review.rating, comment: review.comment });
  };

  const handleUpdateReview = async (e) => {
    e.preventDefault();
    try {
      console.log("Updating review with payload:", editData);
      const res = await updateReview(editData, editingReview);
      if (res) {
        toast.success("Review updated successfully 🎉");
        await getreviews(id);
        setEditingReview(null);
        setEditData({ rating: "", comment: "" });
      }
    } catch (err) {
      console.error("Error updating review:", err);
    }
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      console.log("Deleting review with id:", reviewId);
      const res = await deleteReview(reviewId);
      if (res) {
        toast.success("Review deleted successfully 🗑️");
        await getreviews(id);
      }
    } catch (err) {
      console.error("Error deleting review:", err);
    }
  };

  return (
    propertyData && (
      <>
        <div className="h-full w-full bg-[#FDF6F0] pt-28 px-40">
          {/* Property Images & Info */}
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

          {/* Property Info & Booking */}
          <div className="flex justify-between  w-full px-2 items-end mb-4">
            <div className="w-[50%] mb-40">
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

          {/* Review Section */}
          <div className="mx-auto py-4 relative mt-10 px-10 border-t border-b border-[#B17F44]/20">
            <div className="mt-4 flex-col justify-center items-center">
              {hasReviewed ? (
                <p className="text-center text-[#B17F44] font-semibold mb-4">
                  You have already reviewed this property
                </p>
              ) : (
                <button
                  onClick={() => setShowReviewForm(!showReviewForm)}
                  className="text-center text-[#FDF6F0] bg-[#B17F44] rounded-md py-2 px-6 font-semibold"
                >
                  {showReviewForm ? "Cancel" : "Add Review"}
                </button>
              )}

              {showReviewForm && (
                <form
                  onSubmit={handleReviewSubmit}
                  className="mt-4 p-4 border border-[#B17F44] rounded-lg bg-white mb-20"
                >
                  <label className="block mb-2 text-[#333333]">
                    Rating:
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={newReview.rating}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          rating: Number(e.target.value),
                        })
                      }
                      className="ml-2 w-20 border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-[#B17F44] focus:ring-1 focus:ring-[#B17F44] transition duration-200 ease-in-out"
                      required
                    />
                  </label>

                  <label className="block mb-2 text-[#333333]">
                    Comment:
                    <textarea
                      value={newReview.comment}
                      onChange={(e) =>
                        setNewReview({
                          ...newReview,
                          comment: e.target.value,
                        })
                      }
                      className="w-full h-32 border border-gray-300 rounded px-3 py-2 mt-1 focus:outline-none focus:border-[#B17F44] focus:ring-1 focus:ring-[#B17F44] transition duration-200 ease-in-out"
                      placeholder="Write your review..."
                      required
                    />
                  </label>

                  <button
                    type="submit"
                    className="mt-2 bg-[#B17F44] text-white px-4 py-2 rounded-md"
                  >
                    Submit Review
                  </button>
                </form>
              )}
            </div>
            {/* Guest Favourite Section */}
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
            {/* Ratings Summary */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4 mb-20">
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
            <h2 className="text-3xl text-[#B17F44] font-bold mb-6 text-center">
              Reviews from Guests
            </h2>
            <div className="border-t pt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {(showAllReviews ? reviewData : reviewData.slice(0, 6)).map(
                (review) => {
                  const isUserReview =
                    currentUser && review.user._id === currentUser.user._id;

                  const isMenuOpen = openMenuReviewId === review._id; // check if this review's menu is open

                  return (
                    <div
                      key={review._id}
                      className="bg-[#F9F9F9] rounded-2xl shadow-md p-6 hover:shadow-lg transition duration-200 relative"
                    >
                      <div className="flex items-center mb-4 justify-between">
                        <div className="flex items-center">
                          <div className="w-12 h-12 rounded-full mr-3 bg-[#B17F44]/20 flex items-center justify-center">
                            <i className="ri-user-fill text-[#B17F44] text-xl"></i>
                          </div>
                          <div>
                            <h3 className="font-semibold text-[#333333]">
                              {review.user.username}
                            </h3>
                            <p className="text-sm text-[#888888]">
                              Joined{" "}
                              {new Date(review.user.createdAt).getFullYear()}
                            </p>
                          </div>
                        </div>

                        {isUserReview && (
                          <div className="relative">
                            <button
                              onClick={() =>
                                setOpenMenuReviewId(
                                  isMenuOpen ? null : review._id
                                )
                              }
                              className="text-2xl text-[#666666] hover:text-[#B17F44]"
                            >
                              ⋮
                            </button>

                            {isMenuOpen && (
                              <div className="absolute right-0 top-6 bg-white rounded shadow-md w-32 z-10">
                                <h3
                                  onClick={() => {
                                    handleEditClick(review);
                                    setOpenMenuReviewId(null);
                                  }}
                                  className="text-medium font-semibold px-4 text-[#B17F44] hover:bg-[#B17F44]/20 cursor-pointer transition-all py-2 "
                                >
                                  Update
                                </h3>
                                <h3
                                  onClick={() => {
                                    handleDeleteReview(review._id);
                                    setOpenMenuReviewId(null);
                                  }}
                                  className="text-medium font-semibold px-4 text-[#B17F44] hover:bg-[#B17F44]/20 cursor-pointer transition-all py-2 border-[#B17F44]"
                                >
                                  Delete
                                </h3>
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-[#666666] mb-2 flex items-center gap-2">
                        <span className="text-lg">⭐️ {review.rating}</span>
                        <span className="text-xs text-[#999999]">
                          {new Date(review.createdAt).toDateString()}
                        </span>
                      </p>

                      {editingReview === review._id ? (
                        <form onSubmit={handleUpdateReview} className="mt-2">
                          <input
                            type="number"
                            min="1"
                            max="5"
                            value={editData.rating}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                rating: Number(e.target.value),
                              })
                            }
                            className="w-20 border border-gray-300 rounded px-2 py-1 mb-2"
                            required
                          />
                          <textarea
                            value={editData.comment}
                            onChange={(e) =>
                              setEditData({
                                ...editData,
                                comment: e.target.value,
                              })
                            }
                            className="w-full h-24 border border-gray-300 rounded px-3 py-2 mb-2"
                            required
                          />
                          <div className="flex gap-2">
                            <button
                              type="submit"
                              className="bg-[#B17F44] text-white px-3 py-1 rounded-md"
                            >
                              Save
                            </button>
                            <button
                              type="button"
                              className="bg-gray-400 text-white px-3 py-1 rounded-md"
                              onClick={() => setEditingReview(null)}
                            >
                              Cancel
                            </button>
                          </div>
                        </form>
                      ) : (
                        <p className="text-[#333333] italic leading-relaxed">
                          “{review.comment}”
                        </p>
                      )}
                    </div>
                  );
                }
              )}

              {reviewData?.length > 6 && (
                <div className="col-span-full flex justify-center mt-6">
                  <button
                    onClick={() => setShowAllReviews(!showAllReviews)}
                    className="text-center text-[#FDF6F0] bg-[#B17F44] font-semibold rounded-lg py-3 px-8 shadow-md hover:shadow-lg hover:bg-[#a17039] transition duration-200"
                  >
                    {showAllReviews
                      ? "Show less"
                      : `Show all ${reviewData.length} reviews`}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <Footer />
      </>
    )
  );
};

export default SingleProperty;
