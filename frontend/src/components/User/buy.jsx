 import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../frontend-config/api";

function Buy() {
  const { courseId } = useParams();
  const [course, setCourse] = useState({});
  const [orderDetails, setOrderDetails] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchOrder = async () => {
      try {
        // Step 1: Fetch course
        const courseRes = await axios.get(`${BACKEND_URL}/course/${courseId}`);
        setCourse(courseRes.data.course);

        // Step 2: Create order
        const orderRes = await axios.post(
          `${BACKEND_URL}/order/create`,
          {
            courseId,
            amount: courseRes.data.course.price,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

        setOrderDetails(orderRes.data);
        console.log("Order Details:", orderRes.data);

        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err?.response?.status === 400) {
          setError("You have already purchased this course");
        } else {
          setError(err?.response?.data?.errors || "Something went wrong");
        }
      }
    };

    fetchOrder();
  }, [courseId, token, navigate]);

  const handlePayment = async () => {
    if (!orderDetails) return;

    if (!window.Razorpay) {
      toast.error("Razorpay SDK not loaded. Please refresh the page.");
      return;
    }

    const options = {
      key: orderDetails.key,
      amount: orderDetails.amount,
      currency: orderDetails.currency,
      name: "Course Purchase",
      description: "Payment for course",
      order_id: orderDetails.orderId,
      handler: async function (response) {
        try {
          await axios.post(
            `${BACKEND_URL}/order/verify`,
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              withCredentials: true,
            }
          );
          toast.success("Payment Successful");
          navigate("/purchases");
        } catch (err) {
          toast.error("Payment verification failed");
          console.error(err);
        }
      },
      prefill: {
        name: user?.user?.firstName || "User",
        email: user?.user?.email,
        contact: "+919125691866",
      },
      theme: {
        color: "#6366F1",
      },
    };

    const razor = new window.Razorpay(options);

    razor.on("payment.failed", function (response) {
      toast.error("Payment Failed: " + response.error.description);
    });

    razor.open();
  };

  // ✅ Already Purchased UI
  if (error === "You have already purchased this course") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-yellow-100 text-yellow-800 px-6 py-4 rounded-lg">
          <p className="text-lg font-semibold mb-3">You already own this course!</p>
          <Link
            className="bg-orange-500 text-white py-2 px-6 rounded-md hover:bg-orange-600 transition duration-200"
            to="/purchases"
          >
            Go to My Courses
          </Link>
        </div>
      </div>
    );
  }

  // ✅ Error UI (not purchased-related)
  if (error && error !== "You have already purchased this course") {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
          <p className="text-lg font-semibold">{error}</p>
          <Link
            className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
            to="/"
          >
            Go to Home
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center mt-40 text-white">Loading...</div>;
  }

 return (
  <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-950 to-black flex items-center justify-center px-4 py-16">
    <div className="flex flex-col sm:flex-row w-full max-w-5xl bg-opacity-20 backdrop-blur-lg bg-gray-800/50 rounded-3xl shadow-2xl border border-blue-900">
      
      {/* Left side: Order details */}
      <div className="w-full md:w-1/2 px-9 py-10 text-white">
        <h1 className="text-2xl font-bold underline mb-6">Order Details</h1>

        <div className="mb-6">
          <h2 className="text-gray-300 text-sm">Total Price</h2>
          <p className="text-red-400 font-bold text-2xl">₹{course.price}</p>
        </div>

        <div className="mb-6">
          <h2 className="text-gray-300 text-sm">Course Name</h2>
          <p className="text-red-400 font-bold text-lg">{course.title}</p>
        </div>
      </div>

      {/* Right side: Payment box */}
      <div className="w-full md:w-1/2 flex justify-center items-center px-6 py-10">
        <div className="bg-white/90 backdrop-blur-md shadow-xl rounded-2xl p-8 w-full max-w-sm">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Process your Payment</h2>
          <p className="text-sm text-gray-600 mb-6">Click below to complete your secure payment.</p>
          <button
            onClick={handlePayment}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold text-md hover:bg-indigo-700 transition duration-300 cursor-pointer"
          >
            Pay ₹{course.price}
          </button>
        </div>
      </div>
    </div>
  </div>
);

}

export default Buy;
