import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import axios from "axios";
import { Toaster } from "react-hot-toast";

// User Components
import Home from "./components/User/home";
import Login from "./components/User/login";
import SignUp from "./components/User/signup";
import Courses from "./components/User/courses";
import CourseDetail from "./components/User/CourseDetail";
import Buy from "./components/User/buy";
import Purchases from "./components/User/purchases";
import Settings from "./components/User/setting";
import ForgotPassword from "./components/User/forgotPassWord";
import ResetPassword from "./components/User/ResetPassword";
import VerifyOtp from "./components/User/VerifyOtp";



// Admin Components
import AdminHome from "./components/Admin/AdminHome";
import AdminProfile from "./components/Admin/AdminProfile";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminSignup from "./components/Admin/AdminSignUp";
import AdminDashboard from "./components/Admin/AdminDashboard";
import AdminCreateCourse from "./components/Admin/AdminCreateCourse";
import AdminUpdateCourse from "./components/Admin/AdminUpdateCourse";
import AdminCourseList from "./components/Admin/AdminCourseList";
import AdminPrivateRoute from "./components/Protected/AdminPrivateRoute";

function App() {
  const location = useLocation();
 useEffect(() => {
  const user = JSON.parse(localStorage.getItem("user"));
  const isUserRoute = location.pathname.startsWith("/") || location.pathname.startsWith("/user");

  // If user is logged in and visits an admin route, auto-logout
  if (user?.token && !isUserRoute) {
    axios.post("http://localhost:8001/api/v1/user/logout", {}, {
      withCredentials: true,
    }).then(() => {
      localStorage.removeItem("user");
      console.log("✅ user auto-logged out (visited admin route)");
    }).catch((err) => {
      console.error("⚠️ Auto logout failed", err);
    });
  }
}, [location.pathname]);

  useEffect(() => {
    const admin = JSON.parse(localStorage.getItem("admin"));
    const isAdminRoute = location.pathname.startsWith("/admin");

    // 🛡️ If logged-in admin visits a non-admin route, auto logout
    if (admin?.token && !isAdminRoute) {
      axios.post("http://localhost:8001/api/v1/admin/logout", {}, {
        withCredentials: true,
      }).then(() => {
        localStorage.removeItem("admin");
        console.log("✅ Admin auto-logged out");
      }).catch((err) => {
        console.error("⚠️ Auto logout failed", err);
      });
    }
  }, [location.pathname]);

  return (
    <div>
      <Routes>
        {/* ✅ User Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/courses" element={<Courses />} />
        <Route path="/buy/:courseId" element={<Buy />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/course/:courseId" element={<CourseDetail />} />
        <Route path="user/setting" element={<Settings />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />

        {/* ✅ Admin Public Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/signup" element={<AdminSignup />} />
       
        {/* ✅ Admin Protected Routes */}
        <Route path="/admin" element={<AdminPrivateRoute />}>
       <Route index element={<AdminHome />} /> {/* /admin => AdminHome */}
          <Route path="/admin/profile" element={<AdminProfile />} />

          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="create" element={<AdminCreateCourse />} />
          <Route path="update/:courseId" element={<AdminUpdateCourse />} />
          <Route path="courses" element={<AdminCourseList />} />
        </Route>
      </Routes>

      <Toaster />
    </div>
  );
}

export default App;
