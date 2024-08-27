import React from "react";
import { Link } from "react-router-dom";

const products = [
  { id: 1, name: "Wireless Earbuds", price: 79.99, rating: 4.5 },
  { id: 2, name: "Smart Watch", price: 199.99, rating: 4.2 },
  { id: 3, name: "Bluetooth Speaker", price: 59.99, rating: 4.7 },
  { id: 4, name: "Laptop Backpack", price: 49.99, rating: 4.3 },
  { id: 5, name: "Portable Charger", price: 29.99, rating: 4.6 },
  { id: 6, name: "Wireless Mouse", price: 24.99, rating: 4.4 },
];

const recommendations = [
  { id: 7, name: "4K Smart TV", price: 499.99, rating: 4.8 },
  { id: 8, name: "Noise-Canceling Headphones", price: 149.99, rating: 4.6 },
  { id: 9, name: "Robot Vacuum Cleaner", price: 299.99, rating: 4.5 },
  { id: 10, name: "Electric Toothbrush", price: 89.99, rating: 4.7 },
];

const categories = [
  "Electronics",
  "Clothing",
  "Books",
  "Home & Kitchen",
  "Beauty & Personal Care",
  "Sports & Outdoors",
  "Toys & Games",
  "Automotive",
  "Pet Supplies",
  "Health & Household",
];

export default function LandingPage() {
  const [cartItems, setCartItems] = React.useState(0);
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const addToCart = () => {
    setCartItems((prevItems) => prevItems + 1);
  };

  const ProductGrid = ({ products, title }) => (
    <>
      <h2 className="text-3xl font-bold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="border rounded-lg p-4 shadow-sm flex flex-col"
          >
            <div className="aspect-square bg-muted rounded-md mb-4"></div>
            <h3 className="text-xl font-semibold">{product.name}</h3>
            <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
            <p className="text-sm text-muted-foreground">
              Rating: {product.rating}/5
            </p>
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={addToCart}
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </>
  );

  const HomePage = () => (
    <main className="flex-1 container mx-auto px-4 py-8">
      <ProductGrid products={products} title="Featured Products" />
      <div className="mt-12">
        <ProductGrid products={recommendations} title="Recommended for You" />
      </div>
    </main>
  );

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center justify-center space-x-4">
            <div className="relative">
              <button
                className="px-4 py-2 border items-center rounded hover:bg-gray-200"
                onClick={() => setIsMenuOpen((prev) => !prev)}
              >
                Menu
              </button>
              {isMenuOpen && (
                <div className="absolute top-full mt-2 w-56 bg-white border rounded shadow-lg">
                  <h3 className="px-4 py-2 font-bold">Categories</h3>
                  <div className="h-72 overflow-y-auto">
                    {categories.map((category, index) => (
                      <div key={index} className="px-4 py-2 hover:bg-gray-200">
                        {category}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex-1 max-w-xl mx-4">
            <div className="relative">
              <input
                className="w-full pl-10 pr-4 border rounded"
                placeholder="Search products"
                type="search"
              />
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/profile">
              <button className="px-4 py-2 border rounded hover:bg-gray-200">
                Profile
              </button>
            </Link>
          </div>
        </div>
      </header>
      <HomePage />
    </div>
  );
}
