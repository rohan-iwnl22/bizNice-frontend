import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../Context/CartContext";
import toast from "react-hot-toast";
import axios from "axios";

const CartPage = () => {
  const { cartItems, updateQuantity, removeItem, clearCart } = useCart();
  const navigate = useNavigate();

  // State for address input
  const [address, setAddress] = useState({
    fullName: "",
    email: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India", // Default to India
  });

  // Calculate total price of the cart
  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity,
    0
  );

  // Handle form input changes
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress({ ...address, [name]: value });
  };

  // Validate that all required address fields are filled
  const isAddressValid = () => {
    const { fullName, email, phone, addressLine1, city, state, zipCode } =
      address;
    return (
      fullName && email && phone && addressLine1 && city && state && zipCode
    );
  };

  // Handle checkout button click
  const handleCheckout = async (e) => {
    e.preventDefault();

    // Check if cart is empty
    if (cartItems.length === 0) {
      return toast.error("Your Cart is Empty");
    }

    // Check if user is authenticated
    const token = JSON.parse(localStorage.getItem("User"))?.token;
    if (!token) {
      return toast.error("User not authenticated");
    }

    // Validate address form
    if (!isAddressValid()) {
      return toast.error("Please fill in all required address fields.");
    }

    try {
      const orderData = cartItems.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      }));

      const response = await axios.post(
        "http://localhost:3030/api/order",
        {
          items: orderData,
          shippingAddress: address, // Send shipping address
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const { razorpayOrderId } = response.data;

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID,
        amount: total * 100,
        currency: "INR",
        name: "BizNiche",
        description: "Order Payment",
        order_id: razorpayOrderId,
        handler: async function (response) {
          const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
            response;
          await verifyPayment(
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
          );
        },
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: "#68D89B",
        },
      };

      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      console.log("Error during checkout", error);
      toast.error(`${error.response?.data.message}`);
    }
  };

  // Payment verification
  const verifyPayment = async (order_id, payment_id, signature) => {
    try {
      const token = JSON.parse(localStorage.getItem("User"))?.token;
      const response = await axios.post(
        "http://localhost:3030/api/order/verify",
        {
          razorpay_order_id: order_id,
          razorpay_payment_id: payment_id,
          razorpay_signature: signature,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.message === "Payment Verified") {
        toast.success("Payment Successful! Order Placed");
        clearCart();
        navigate("/");
      } else {
        toast.error("Payment verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Payment verification failed:", error);
      toast.error(`${error.response?.data.message}`);
    }
  };

  return (
    <main className="flex flex-col md:flex-row container mx-auto px-4 py-8 space-y-8 md:space-y-0 md:space-x-8">
      {/* Cart Items Section */}
      <section className="w-full md:w-2/3">
        <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
        {cartItems.length === 0 ? (
          <div className="text-center">
            <p className="text-lg">Your cart is currently empty.</p>
            <Link to="/">
              <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                Continue Shopping
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {cartItems.map((item) => (
              <div key={item.id} className="border rounded-lg p-4 shadow-sm">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold">{item.name}</h2>
                  <p className="text-lg font-bold">${item.price.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <div className="flex items-center space-x-2">
                    <button
                      className="px-3 py-1 border rounded hover:bg-gray-200"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        updateQuantity(item.id, parseInt(e.target.value, 10))
                      }
                      className="w-16 text-center border rounded py-1"
                    />
                    <button
                      className="px-3 py-1 border rounded hover:bg-gray-200"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Address Form & Order Summary Section */}
      <section className="w-full md:w-1/3 bg-gray-50 rounded-lg p-6 shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Order Summary</h2>

        {/* Shipping Address Form */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Shipping Address</h3>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={address.fullName}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={address.email}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Phone Number"
            value={address.phone}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={address.addressLine1}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2 (Optional)"
            value={address.addressLine2}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="zipCode"
            placeholder="ZIP Code"
            value={address.zipCode}
            onChange={handleAddressChange}
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="text"
            name="country"
            placeholder="Country"
            value={address.country}
            disabled
            className="w-full px-4 py-2 border rounded bg-gray-100"
          />
        </div>

        {/* Order Summary */}
        <div className="space-y-2 mt-4">
          <div className="flex justify-between">
            <p>Subtotal:</p>
            <p>₹{total.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p>Shipping:</p>
            <p>Free</p>
          </div>
          <div className="flex justify-between font-bold text-lg">
            <p>Total:</p>x<p>₹{total.toFixed(2)}</p>
          </div>
        </div>

        <button
          className="w-full mt-6 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={handleCheckout}
        >
          Proceed to Checkout
        </button>
      </section>
    </main>
  );
};

export default CartPage;
