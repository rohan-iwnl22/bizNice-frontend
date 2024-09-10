import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Auth } from "../Context/Auth"; // Ensure correct import path and context name

const Header = () => {
  const { user, logout, seller } = useContext(Auth);

  return (
    <header className="w-full bg-black text-white fixed top-0 z-50 shadow-lg">
      <div className="container mx-auto flex items-center justify-between py-4 px-6">
        <div className="text-4xl font-bold font-mono">
          <Link to="/">BizNiche</Link>
        </div>
        <nav className="flex space-x-4 items-center">
          {user && (
            <span className="text-warning">Logged in as {user.name}</span>
          )}
          <Link to="/cart">
            <button className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300">
              CartItem
            </button>
          </Link>
          {user ? (
            <>
              {seller ? (
                <Link to="/post-products">
                  <button className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300">
                    Post Your Products
                  </button>
                </Link>
              ) : (
                <Link to="/seller">
                  <button className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300">
                    Become a Seller
                  </button>
                </Link>
              )}
              <button
                className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300"
                onClick={logout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/register">
                <button className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300">
                  Register
                </button>
              </Link>
              <Link to="/login">
                <button className="h-10 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded transition duration-300">
                  Login
                </button>
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
