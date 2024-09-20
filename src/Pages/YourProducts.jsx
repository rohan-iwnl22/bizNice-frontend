import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

const YourProducts = () => {
  const [products, setProducts] = useState([]);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false); // Popup state
  const [successToastShown, setSuccessToastShown] = useState(false);
  const [errorToastShown, setErrorToastShown] = useState(false);
  const [emptyToastShown, setEmptyToastShown] = useState(false);

  // Initialize GoogleGenerativeAI with the API Key
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);

  useEffect(() => {
    const fetchOrders = async () => {
      const storedUser = localStorage.getItem("User");
      const token = storedUser ? JSON.parse(storedUser).token : null;

      try {
        const response = await axios.get("http://localhost:3030/api/order", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.data.your_orders.length === 0) {
          if (!emptyToastShown) {
            toast.info("No products purchased yet.");
            setEmptyToastShown(true);
          }
        } else {
          setProducts(response.data.your_orders);
          if (!successToastShown) {
            toast.success("Orders fetched successfully.");
            setSuccessToastShown(true);
          }
          fetchRecommendedProducts(response.data.your_orders);
        }
      } catch (error) {
        setError(error.message);
        if (!errorToastShown) {
          toast.error("Failed to fetch orders.");
          setErrorToastShown(true);
        }
      } finally {
        setLoading(false);
      }
    };

    const fetchRecommendedProducts = async (orders) => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });

        // Prepare product names from orders to send to the API
        const productNames = orders
          .map((order) => order.product_name)
          .join(", ");
        const result = await model.generateContent(
          `Recommend products similar to: ${productNames}`
        );

        const response = await result.response;
        const text = await response.text();

        console.log("Raw Response from Gemini API:", text); // Log raw response for debugging

        // Clean up the response: strip `*`, `**`, and empty lines
        const recommendations = text
          .split("\n") // Split by newlines
          .map((item) => item.replace(/[*]|\s*\*\*/g, "").trim()) // Remove `*` and `**`
          .filter((item) => item); // Filter out empty strings

        setRecommendedProducts(recommendations);
        setShowPopup(true); // Show popup when recommendations are available
      } catch (error) {
        console.log("Error fetching recommendations", error.message);
      }
    };

    fetchOrders();
  }, [successToastShown, errorToastShown, emptyToastShown]);

  const handlePopupToggle = () => {
    setShowPopup((prevShowPopup) => !prevShowPopup); // Toggle the popup state
  };

  if (loading) return <div className="text-center text-2xl">Loading...</div>;
  if (error)
    return (
      <div className="h-screen flex justify-center items-center text-center text-2xl text-red-500">
        Unable to fetch orders. Please try again later.
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-10">
          <h1
            className="text-4xl font-extrabold text-gray-800 font-serif"
            style={{ fontFamily: "Roboto Condensed" }}
          >
            Your Products
          </h1>
        </div>

        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          style={{ fontFamily: "Nunito" }}
        >
          {products.length > 0 ? (
            products.map((order) => (
              <div
                key={order.order_id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
              >
                <img
                  src={order.product_image_url}
                  alt={order.product_name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {order.product_name}
                  </h2>
                  <p className="text-gray-600 mb-4">
                    Total Price: ${order.total_price}
                  </p>
                  <p className="text-gray-600 mb-4">
                    Quantity: {order.quantity}
                  </p>
                  <p className="text-gray-600 mb-4">Status: {order.status}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-2xl">
              You have not purchased any products yet.
            </div>
          )}
        </div>

        {/* Popup for Recommended Products */}
        {showPopup && (
          <div
            className="fixed bottom-10 right-10 bg-white rounded-lg shadow-lg p-4 w-80 z-50"
            style={{ maxHeight: "300px", overflowY: "auto" }} // Scrollable style
          >
            <h2 className="text-lg font-bold mb-2">Recommended Products</h2>
            <div className="space-y-2">
              {recommendedProducts.map((product, index) => (
                <div key={index} className="text-gray-800">
                  {product}
                </div>
              ))}
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handlePopupToggle} // Toggle popup visibility
            >
              Close
            </button>
          </div>
        )}
        {!showPopup && (
          <button
            className="fixed bottom-10 right-10 bg-blue-500 text-white px-4 py-2 rounded"
            onClick={handlePopupToggle} // Toggle popup visibility
          >
            Open Recommendations
          </button>
        )}
      </div>
    </div>
  );
};

export default YourProducts;
