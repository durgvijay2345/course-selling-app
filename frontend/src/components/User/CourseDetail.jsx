import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { BACKEND_URL } from "../../frontend-config/api";

function CourseDetail() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hasPurchased, setHasPurchased] = useState(false);

  const token = JSON.parse(localStorage.getItem("user"))?.token;
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchCourse = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/course/${courseId}`);
      const courseData = res.data.course;
      setCourse(courseData);

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
      navigate("/purchases");  // Redirect to Purchases page after review
    } catch (err) {
      toast.error(err.response?.data?.errors || "Failed to submit review");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] flex items-center justify-center px-4 py-10">
      {course ? (
        <div className="max-w-4xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Left: Course Image */}
            <div className="h-64 md:h-auto">
              <img
                src={course.image?.url || "https://via.placeholder.com/600x300"}
                alt={course.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Right: Course Info */}
            <div className="p-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-4">{course.title}</h1>
              <p className="text-gray-600 mb-6">{course.description}</p>

              <div className="bg-gray-100 p-4 rounded-lg mb-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-1">Course Price</h3>
                <p className="text-2xl font-bold text-green-600">
                  ₹{course.price}
                  <span className="text-sm text-gray-500 line-through ml-2">₹5999</span>
                </p>
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">Leave a Review</h2>

                {user ? (
                  hasPurchased ? (
                    <form onSubmit={handleSubmitReview} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-600 mb-1">
                          Rate this course:
                        </label>
                        <select
                          value={rating}
                          onChange={(e) => setRating(Number(e.target.value))}
                          required
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500"
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
                          className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-800 focus:ring-2 focus:ring-indigo-500"
                          rows={4}
                          required
                        ></textarea>
                      </div>

                      <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white font-semibold py-2 rounded-md hover:bg-indigo-700 transition"
                      >
                        {course.reviews?.some((r) => r.user._id === user?.user?._id)
                          ? "Update Review"
                          : "Submit Review"}
                      </button>
                    </form>
                  ) : (
                    <p className="text-yellow-500 font-medium">
                      You need to purchase this course to leave a review.
                    </p>
                  )
                ) : (
                  <p className="text-blue-500 font-medium">
                    Please log in to review this course.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-white text-xl">Loading course details...</p>
      )}
    </div>
  );
}

export default CourseDetail;

