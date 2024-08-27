import React, { useState } from "react";
import { Link } from "react-router-dom";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "Wireless Earbuds", price: 79.99, quantity: 1 },
    { id: 2, name: "Smart Watch", price: 199.99, quantity: 1 },
  ]);

  const updateQuantity = (id, newQuantity) => {
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: Math.max(1, newQuantity) } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const total = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <main className="flex-1 container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      {cartItems.length === 0 ? (
        <div>
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
                      updateQuantity(item.id, parseInt(e.target.value))
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
          <div className="flex justify-between items-center mt-6 font-bold text-xl">
            <h2>Total:</h2>
            <p>${total.toFixed(2)}</p>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600">
            Proceed to Checkout
          </button>
        </div>
      )}
    </main>
  );
};

export default CartPage;
