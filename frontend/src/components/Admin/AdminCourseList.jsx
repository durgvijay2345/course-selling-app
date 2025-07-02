import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate,Link } from 'react-router-dom';
import logo from "../../assets/logo.png";
import { FaEdit, FaTrashAlt } from "react-icons/fa";
import { BACKEND_URL } from "../../frontend-config/api";



function AdminCourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null); // course ID to confirm
  

  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;
  const currentAdminId = admin?.admin?._id || admin?.user?._id; // handles both formats

  useEffect(() => {
    if (!token) {
      toast.error("Please login as admin first");
      navigate("/admin/login");
      return;
    }

    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BACKEND_URL}/course/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCourses(res.data.courses);
    } catch (err) {
      toast.error("Failed to fetch courses");
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = (courseId) => {
  setConfirmDeleteId(courseId); // opens confirmation modal
};

const handleConfirmDelete = async () => {
  try {
    await axios.delete(`${BACKEND_URL}/course/delete/${confirmDeleteId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    toast.success("Course deleted");
    fetchCourses();
    setConfirmDeleteId(null); // close modal
  } catch (err) {
    toast.error("Delete failed");
  }
};

const cancelDelete = () => {
  setConfirmDeleteId(null); // close modal
};
 const handleEdit = (courseId) => {
    navigate(`/admin/update/${courseId}`);
  };

  const filteredCourses = courses.filter(course =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white flex flex-col md:flex-row">
    {/* ✅ Sidebar */}
    <div className="w-full md:w-64 flex-shrink-0 p-4 md:p-6 bg-gray-900 text-white flex flex-col justify-between">
      {/* Top Part */}
      <div>
        <img src={logo} alt="Logo" className="rounded-full h-16 w-16 md:h-20 md:w-20 mb-4 mx-auto md:mx-0" />
        <h2 className="text-2xl md:text-3xl font-extrabold text-blue-600 drop-shadow mb-4 text-center md:text-left">Our Courses</h2>
        <Link
          to="/admin/dashboard"
          className="bg-red-600 px-4 py-2 rounded hover:bg-green-700 transition block text-center md:text-left"
        >
          Back to Dashboard
        </Link>
      </div>

      {/* Bottom Search Bar */}
      <div className="mt-6">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pr-10 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="absolute right-3 top-2.5 text-gray-400 pointer-events-none">🔍</span>
        </div>
      </div>
    </div>

    {/* ✅ Main Content */}
    <div className="flex-1 overflow-y-auto p-4 md:p-6">
      {/* 🔁 Course Grid */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredCourses.length === 0 ? (
        <p>No matching courses found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <div key={course._id} className="border rounded-lg shadow p-4 bg-gray-800 text-white flex flex-col h-full">
              {course.image?.url ? (
                <img
                  src={course.image.url}
                  alt={course.title}
                  className="h-40 w-full object-cover rounded mb-3"
                />
              ) : (
                <div className="h-40 w-full bg-gray-700 rounded mb-3 flex items-center justify-center">
                  <span className="text-gray-400">No Image</span>
                </div>
              )}
              <h3 className="text-lg font-semibold">{course.title}</h3>
              <p className="text-gray-300 mt-1 flex-grow">{course.description}</p>
              <p className="text-green-400 font-bold mt-2">₹{course.price}</p>

              {String(course.creatorId) === String(currentAdminId) && (
                <div className="flex space-x-3 mt-4">
                  <button
                    onClick={() => handleEdit(course._id)}
                    className="flex items-center gap-2 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
                  >
                    <FaEdit className="text-lg" />
                    Edit
                  </button>

                  <button
                    onClick={() => confirmDelete(course._id)}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-4 py-2 rounded-lg transition duration-200 shadow-sm hover:shadow-md"
                  >
                    <FaTrashAlt className="text-lg" />
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 🗑️ Confirm Delete Popup */}
      {confirmDeleteId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center">
            <h2 className="text-xl font-semibold mb-4 text-black">Are you sure you want to delete this course?</h2>
            <div className="flex justify-center gap-4">
              <button
                onClick={handleConfirmDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Yes
              </button>
              <button
                onClick={cancelDelete}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  </div>
);



}

export default AdminCourseList;
   