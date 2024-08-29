import React, { useContext } from "react";
import { Auth } from "../Context/Auth";

const DashboardPage = () => {
  const { user } = useContext(Auth);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-800 text-white flex flex-col">
        <div className="h-16 flex items-center justify-center text-2xl font-bold border-b border-blue-700">
          BizNiche Dashboard
        </div>
        <nav className="flex-grow px-4 py-8 space-y-2">
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Overview
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Sales
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Products
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Customers
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Reports
          </a>
          <a
            href="#"
            className="block py-2.5 px-4 rounded hover:bg-blue-700 transition duration-300"
          >
            Settings
          </a>
        </nav>
        <div className="p-4 border-t border-blue-700">
          <button className="w-full py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded transition duration-300">
            Logout
          </button>
        </div>
      </aside>
      <div className="flex-grow p-8 overflow-y-auto">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">
            Welcome back, {user?.name}
          </h1>
          <button className="py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded transition duration-300">
            Create New
          </button>
        </header>

        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">Total Sales</h2>
            <p className="text-3xl font-bold text-blue-600 mt-4">$24,500</p>
            <p className="text-sm text-gray-500 mt-2">+12% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">New Orders</h2>
            <p className="text-3xl font-bold text-blue-600 mt-4">134</p>
            <p className="text-sm text-gray-500 mt-2">+8% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              Active Products
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-4">56</p>
            <p className="text-sm text-gray-500 mt-2">+5% from last month</p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold text-gray-800">
              New Customers
            </h2>
            <p className="text-3xl font-bold text-blue-600 mt-4">32</p>
            <p className="text-sm text-gray-500 mt-2">+18% from last month</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className="bg-white p-8 rounded-lg shadow-lg mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Sales Overview
          </h2>
          <div className="w-full h-64 bg-gray-100 rounded-lg">
            {/* Placeholder for Chart */}
            <p className="text-gray-500 flex items-center justify-center h-full">
              [Insert Chart Here]
            </p>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Recent Activities
          </h2>
          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <p className="text-gray-700">New order #12345 from John Doe</p>
              <span className="text-sm text-gray-500">5 mins ago</span>
            </li>
            <li className="flex items-center justify-between">
              <p className="text-gray-700">
                Product "Wireless Headphones" added
              </p>
              <span className="text-sm text-gray-500">30 mins ago</span>
            </li>
            <li className="flex items-center justify-between">
              <p className="text-gray-700">Payment of $120 received</p>
              <span className="text-sm text-gray-500">1 hour ago</span>
            </li>
            <li className="flex items-center justify-between">
              <p className="text-gray-700">Customer "Jane Smith" registered</p>
              <span className="text-sm text-gray-500">2 hours ago</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
