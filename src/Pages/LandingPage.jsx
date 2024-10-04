import { useContext, useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";
import { useCart } from "../Context/CartContext"; // Import the Cart context
import toast from "react-hot-toast";
import { Auth } from "../Context/Auth";
import { Link } from "react-router-dom";

const ProductList = () => {
  const { user } = useContext(Auth);
  const { addToCart } = useCart(); // Use the addToCart function from the Cart context
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("lowToHigh"); // New state for sorting
  const [bestSelling, setBestSelling] = useState([]);
  const [isBest, setIsBest] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3030/api/product/");
        console.log(response.data);

        // Filter out products with stock 0
        const filteredProducts = response.data.products.filter(
          (product) => product.stock > 0
        );

        setProducts(filteredProducts || []);

        // Extract unique categories from filtered products
        const uniqueCategories = [
          ...new Set(filteredProducts.map((product) => product.category_name)),
        ];
        setCategories(["All", ...uniqueCategories]);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const fetchBestSelling = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3030/api/product/bestSelling"
      );
      setBestSelling(response.data.products || []); // Fetch best-selling products
      setIsBest(true); // Toggle to best-selling mode
    } catch (error) {
      console.error("Error fetching best-selling products:", error.message);
    }
  };

  const handleClick = (product) => {
    if (!user) {
      return toast.error("Please Login First");
    } else {
      addToCart({
        id: product.product_id,
        name: product.name,
        price: parseFloat(product.price),
      });
      toast.success(`${product.name} added to cart!`);
    }
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  const handleDefaultProducts = () => {
    setIsBest(false);
  };

  if (loading) return <div className="text-center text-2xl">Loading...</div>;
  if (error)
    return (
      <div className="h-screen flex justify-center items-center text-center text-2xl text-red-500">
        No Products to Showcase. Come Back Later.
      </div>
    );

  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
  };

  // Filter products based on selected category
  const filteredProducts =
    selectedCategory === "All"
      ? products
      : products.filter(
          (product) => product.category_name === selectedCategory
        );

  // Sort products based on selected sort order
  const sortedProducts = filteredProducts.sort((a, b) => {
    if (sortOrder === "lowToHigh") {
      return a.price - b.price;
    } else {
      return b.price - a.price;
    }
  });

  const displayedProducts = isBest ? bestSelling : sortedProducts; // Display either best-selling or sorted products

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 py-10">
      {/* Hero Section */}
      <div className="container mx-auto px-4 mb-10">
        <div className="text-center mb-10">
          <h1
            className="text-5xl font-bold text-gray-800 mb-6"
            style={{ fontFamily: "Roboto Condensed" }}
          >
            Welcome to BizNiche
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Discover our wide range of exclusive products, hand-picked just for
            you.
          </p>
          <button className="bg-indigo-500 hover:bg-indigo-600 text-white py-3 px-8 rounded-lg font-semibold shadow-lg">
            Shop Now
          </button>
        </div>

        <div className="flex justify-center items-center mb-10">
          <div className="relative inline-block">
            <select
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {categories.map((category, index) => (
                <option key={index} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order Section */}
          <div className="relative inline-block ml-4">
            <select
              value={sortOrder}
              onChange={handleSortOrderChange}
              className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="lowToHigh">Price: Low to High</option>
              <option value="highToLow">Price: High to Low</option>
            </select>
          </div>

          {/* Toggle Best Selling Section */}
          <div className="relative inline-block ml-4">
            <button
              onClick={isBest ? handleDefaultProducts : fetchBestSelling} // Toggle between best-selling and default products
              className="bg-white border border-gray-300 text-gray-800 py-2 px-4 rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {isBest ? "Show All Products" : "Best Selling Products"}
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10"
          style={{ fontFamily: "Nunito" }}
        >
          {displayedProducts.map((product) => {
            const imageUrls = product.image_url.split(",");

            return (
              <div
                key={product.product_id}
                className="bg-white rounded-lg shadow-lg overflow-hidden transform transition duration-300 hover:scale-105"
              >
                {imageUrls.length > 1 ? (
                  <Slider {...sliderSettings}>
                    {imageUrls.map((url, index) => (
                      <div key={index}>
                        <img
                          src={url}
                          alt={`${product.name}-${index}`}
                          className="w-full h-64 object-cover"
                        />
                      </div>
                    ))}
                  </Slider>
                ) : (
                  <img
                    src={imageUrls[0]}
                    alt={product.name}
                    className="w-full h-64 object-cover"
                  />
                )}
                <div className="p-6">
                  <h2 className="text-xl font-semibold text-gray-800 mb-2">
                    {product.name}
                  </h2>
                  <p className="text-gray-600 mb-4">{product.description}</p>
                  <p className="text-lg font-bold text-gray-800 mb-2">
                    ₹{product.price}
                  </p>
                  <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
                  <p className="text-gray-600 mb-4">
                    Category: {product.category_name}
                  </p>
                  <button
                    className="w-full bg-indigo-500 hover:bg-indigo-600 text-white py-2 rounded-lg font-semibold shadow-lg transition duration-300 ease-in-out transform hover:scale-105"
                    onClick={() => handleClick(product)}
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProductList;
