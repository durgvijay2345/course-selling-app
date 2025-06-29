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

  // ✅ Fetch course details
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await axios.get(`${BACKEND_URL}/course/${courseId}`);
        setCourse(res.data.course);
      } catch (err) {
        toast.error("Failed to load course");
      }
    };

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
        setHasPurchased(res.data.purchased); // expects { purchased: true/false }
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
      setRating(0);
      setComment("");
    } catch (err) {
      toast.error(err.response?.data?.errors || "Failed to submit review");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      {course && (
        <>
          <h1 className="text-2xl font-bold mb-4">{course.title}</h1>
          <img src={course.image?.url} alt={course.title} className="mb-4 rounded" />
          <p className="mb-4">{course.description}</p>

          {/* ✅ Review section */}
          {user ? (
            hasPurchased ? (
              <form onSubmit={handleSubmitReview} className="bg-white p-4 rounded shadow">
                <label className="block mb-2 font-semibold">Rate this course:</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(Number(e.target.value))}
                  required
                  className="w-full mb-3 border p-2 rounded"
                >
                  <option value="">Select rating</option>
                  <option value="1">⭐ 1</option>
                  <option value="2">⭐⭐ 2</option>
                  <option value="3">⭐⭐⭐ 3</option>
                  <option value="4">⭐⭐⭐⭐ 4</option>
                  <option value="5">⭐⭐⭐⭐⭐ 5</option>
                </select>

                <textarea
                  placeholder="Write your feedback..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full border p-2 rounded mb-3"
                  rows={4}
                ></textarea>

                <button
                  type="submit"
                  className="bg-orange-500 text-white py-2 px-4 rounded hover:bg-orange-600"
                >
                  Submit Review
                </button>
              </form>
            ) : (
              <p className="text-red-500 mt-4">
                You need to purchase the course to give a review.
              </p>
            )
          ) : (
            <p className="text-blue-600 mt-4">Please log in to review this course.</p>
          )}
        </>
      )}
    </div>
  );
}

export default CourseDetail;
