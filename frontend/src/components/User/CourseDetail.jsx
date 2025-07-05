import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../frontend-config/api";

function CourseDetail() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);

  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const user = JSON.parse(localStorage.getItem("user"));

  // ✅ Fetch course details & check if user already reviewed
  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/course/${courseId}`);
      const courseData = res.data.course;
      setCourse(courseData);

      // ✅ Prefill if already reviewed
      const existingReview = courseData.reviews.find(
        (review) => review.user._id === user?.user?._id
      );

      if (existingReview) {
        setRating(existingReview.rating);
        setComment(existingReview.comment);
      }
    } catch (err) {
      toast.error("Failed to load course");
    }
  };

  useEffect(() => {
    fetchCourse();
  }, [courseId]);

  // ✅ Check if user purchased the course
  useEffect(() => {
    const checkPurchase = async () => {
      if (!token) return;
      try {
        const res = await axios.get(`${BACKEND_URL}/purchase/check/${courseId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setHasPurchased(res.data.purchased);
      } catch (err) {
        console.error("Purchase check failed", err);
      }
    };

    checkPurchase();
  }, [courseId, token]);

  // ✅ Submit review handler
  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${BACKEND_URL}/course/${courseId}/review`,
        { rating, comment },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      toast.success("Review submitted!");
      fetchCourse(); // 🔁 Re-fetch course to update reviews
    } catch (err) {
      toast.error(err.response?.data?.errors || "Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://images.unsplash.com/photo-1581091226825-a6a2a5aee158')] bg-cover bg-center bg-no-repeat relative">
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Main Content Card */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-white">
        {course && (
          <>
            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-orange-400 underline decoration-orange-500">
              {course.title}
            </h1>

            {/* Course Details */}
            <div className="flex flex-col lg:flex-row gap-8 mb-12 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-xl">
              {/* Left: Image */}
              <div className="w-full lg:w-1/2 flex justify-center items-center">
                <img
                  src={course.image?.url || "https://via.placeholder.com/600x300"}
                  alt={course.title}
                  className="w-full max-w-md h-64 sm:h-72 md:h-80 object-cover rounded-xl shadow-md border border-white/20"
                />
              </div>

              {/* Right: Description + Price */}
              <div className="w-full lg:w-1/2 space-y-6">
                <p className="text-gray-200 leading-relaxed text-lg">{course.description}</p>

                <div className="bg-gray-900/70 p-5 rounded-xl border border-gray-600 shadow-lg">
                  <h3 className="text-xl font-semibold mb-2 text-orange-300">Course Price</h3>
                  <p className="text-2xl font-bold text-green-400">
                    ₹{course.price}
                    <span className="text-sm text-gray-400 line-through ml-2">₹5999</span>
                  </p>
                </div>
              </div>
            </div>

            {/* Review Section */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg">
              <h2 className="text-2xl font-bold text-white mb-4">Leave a Review</h2>

              {user ? (
                hasPurchased ? (
                  <form onSubmit={handleSubmitReview} className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-1">
                        Rate this course:
                      </label>
                      <select
                        value={rating}
                        onChange={(e) => setRating(Number(e.target.value))}
                        required
                        className="w-full rounded-md border border-gray-600 bg-gray-800 text-white p-2 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      >
                        <option value="">Select rating</option>
                        <option value="1">⭐ 1</option>
                        <option value="2">⭐⭐ 2</option>
                        <option value="3">⭐⭐⭐ 3</option>
                        <option value="4">⭐⭐⭐⭐ 4</option>
                        <option value="5">⭐⭐⭐⭐⭐ 5</option>
                      </select>
                    </div>

                    <div>
                      <textarea
                        placeholder="Write your feedback..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        className="w-full border border-gray-600 bg-gray-800 text-white p-3 rounded-md focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        rows={5}
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="bg-orange-500 text-white font-semibold py-2 px-6 rounded-md hover:bg-orange-600 transition duration-200"
                    >
                      {course.reviews?.some((r) => r.user._id === user?.user?._id)
                        ? "Update Review"
                        : "Submit Review"}
                    </button>
                  </form>
                ) : (
                  <p className="text-yellow-400 mt-4 font-medium">
                    You need to purchase this course to leave a review.
                  </p>
                )
              ) : (
                <p className="text-blue-400 mt-4 font-medium">
                  Please log in to review this course.
                </p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CourseDetail;
