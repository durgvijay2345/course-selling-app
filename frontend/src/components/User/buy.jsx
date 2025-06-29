 import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useParams } from "react-router-dom";
import { BACKEND_URL } from "../../frontend-config/api";

function buy() {
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
        const res = await axios.post(
          `${BACKEND_URL}/course/buy/${courseId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true,
          }
        );

     setCourse(res.data.course);

        setOrderDetails(res.data); // contains orderId, amount, key, etc.
        setLoading(false);
      } catch (err) {
        setLoading(false);
        if (err?.response?.status === 400) {
          setError("You have already purchased this course");
          navigate("/purchases");
        } else {
          setError(err?.response?.data?.errors || "Something went wrong");
        }
      }
    };

    fetchOrder();
  }, [courseId]);
   if (!course) {
    return <div>Loading course details...</div>;
  }

  const handlePayment = async () => {
    if (!orderDetails) return;

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
        contact: "9999999999",
      },
      theme: {
        color: "#6366F1",
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

 return error ? (
  <div className="flex justify-center items-center h-screen">
    <div className="bg-red-100 text-red-700 px-6 py-4 rounded-lg">
      <p className="text-lg font-semibold">{error}</p>
      <Link
        className="w-full bg-orange-500 text-white py-2 rounded-md hover:bg-orange-600 transition duration-200 mt-3 flex items-center justify-center"
        to={"/purchases"}
      >
        Go to Purchases
      </Link>
    </div>
  </div>
) : loading ? (
  <div className="text-center mt-40">Loading...</div>
) : (
  <div className="flex flex-col sm:flex-row my-40 container mx-auto px-4">
    {/* Left side: Order details aligned to left */}
    <div className="w-full md:w-1/2 px-9 mb-8 md:mb-0">
      <h1 className="text-xl font-semibold underline mb-6">Order Details</h1>

      <div className="mb-4">
        <h2 className="text-gray-600 text-sm">Total Price</h2>
        <p className="text-red-500 font-bold text-lg">₹{course.price}</p>
      </div>

      <div className="mb-4">
        <h2 className="text-gray-600 text-sm">Course Name</h2>
        <p className="text-red-500 font-bold text-lg">{course.title}</p>
      </div>
    </div>

    {/* Right side: Payment button */}
    <div className="w-full md:w-1/2 flex justify-center items-center px-6">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-sm">
        <h2 className="text-lg font-semibold mb-4">Process your Payment!</h2>
        <button
          onClick={handlePayment}
          className="mt-4 w-full bg-indigo-500 text-white py-2 rounded-md hover:bg-indigo-600 transition duration-200"
        >
          Pay ₹{course.price}
        </button>
      </div>
    </div>
  </div>
);

}

export default buy;
