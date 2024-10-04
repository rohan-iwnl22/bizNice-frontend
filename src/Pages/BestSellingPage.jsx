import axios from "axios";
import { useEffect, useState } from "react";

const ProductList = () => {
  const [products, setProducts] = useState([]);  // State for normal products
  const [bestSelling, setBestSelling] = useState([]);  // State for best-selling products

  // Fetch normal products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3030/api/product");
        setProducts(response.data);  // Assuming the product data is in response.data
      } catch (error) {
        console.error("Error fetching products:", error.message);
      }
    };

    fetchProducts();  // Call the fetch function
  }, []);

  // Fetch best-selling products
  useEffect(() => {
    const fetchBestSelling = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3030/api/product/bestSelling"
        );
        console.log("Best-Selling Products:", response.data);
        setBestSelling(response.data.products);  // Adjusted for the 'products' key
      } catch (error) {
        console.error("Error fetching best-selling products:", error.message);
      }
    };

    fetchBestSelling();  // Call the fetch function
  }, []);

  return (
    <div className="container mx-auto">
      <h2 className="text-2xl font-bold mb-4">Product List</h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Render all products */}
        {products.map((product) => (
          <li key={product.product_id} className="p-4 border rounded-lg">
            <h3 className="text-lg font-semibold">{product.product_name}</h3>
            <img
              src={product.image_url}
              alt={product.product_name}
              className="w-full h-64 object-cover"
            />
            <p>Category: {product.category_name}</p>
            <p>Price: ${product.price}</p>
          </li>
        ))}
      </ul>

      <h2 className="text-2xl font-bold mt-10 mb-4">Best-Selling Products</h2>
      <ul className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Render best-selling products */}
        {bestSelling.length > 0 ? (
          bestSelling.map((product) => (
            <li key={product.product_id} className="p-4 border rounded-lg">
              <h3 className="text-lg font-semibold">{product.name}</h3>
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-64 object-cover"
              />
              <p>Category: {product.category_name}</p>
              <p>Price: ${product.price}</p>
              <p>Total Revenue: ${product.total_revenue}</p>
            </li>
          ))
        ) : (
          <li>No best-selling products available</li>
        )}
      </ul>
    </div>
  );
};

export default ProductList;
