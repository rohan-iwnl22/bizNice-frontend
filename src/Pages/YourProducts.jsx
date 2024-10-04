import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { GoogleGenerativeAI } from "@google/generative-ai";

const YourProducts = () => {
  const [products, setProducts] = useState([]);
  const [recommendations, setRecommendations] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null); // To track which product's recommendations to show

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

          // Fetch recommendations for each product
          response.data.your_orders.forEach((order) =>
            fetchRecommendedProducts(order)
          );
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

    const fetchRecommendedProducts = async (order) => {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent(
          `Recommend products similar to: ${order.product_name}`
        );

        const response = await result.response;
        const text = await response.text();

        // Clean up the response: strip `*`, `**`, and empty lines
        const recommendationsForProduct = text
          .split("\n")
          .map((item) => item.replace(/[*]|\s*\*\*/g, "").trim())
          .filter((item) => item)
          .slice(0, 5); // Limit to top 5 recommendations

        // Store recommendations for this specific product
        setRecommendations((prev) => ({
          ...prev,
          [order.order_id]: recommendationsForProduct,
        }));
      } catch (error) {
        console.log("Error fetching recommendations", error.message);
      }
    };

    fetchOrders();
  }, [successToastShown, errorToastShown, emptyToastShown]);

  const handlePopupToggle = (orderId) => {
    setCurrentProductId(orderId);
    setShowPopup((prevShowPopup) => !prevShowPopup);
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
                  className="w-full h-64 object-cover transition-transform hover:scale-105"
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

                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
                    onClick={() => handlePopupToggle(order.order_id)}
                  >
                    View Recommendations
                  </button>
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
        {showPopup && currentProductId && (
          <div
            className="fixed bottom-10 right-10 bg-white rounded-lg shadow-lg p-4 w-80 z-50 transition-all duration-300 ease-in-out"
            style={{ maxHeight: "300px", overflowY: "auto" }}
          >
            <h2 className="text-lg font-bold mb-2">Recommended Products</h2>
            <div className="space-y-2">
              {recommendations[currentProductId] &&
              recommendations[currentProductId].length > 0 ? (
                recommendations[currentProductId].map((product, index) => (
                  <div key={index} className="text-gray-800">
                    {product}
                  </div>
                ))
              ) : (
                <p>No recommendations available for this product.</p>
              )}
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-all"
              onClick={handlePopupToggle}
            >
              Close
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default YourProducts;
