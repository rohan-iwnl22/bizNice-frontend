import { useEffect, useState } from "react";
import axios from "axios";
import Slider from "react-slick";

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:3030/api/product/");
        setProducts(response.data.products || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) return <div className="text-center text-2xl">Loading...</div>;
  if (error)
    return (
      <div className="h-screen flex justify-center items-center text-center text-2xl text-red-500">
        No Products to ShowCase Come Back Later
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

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">
          Our Products
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {products.map((product) => {
            const imageUrls = product.image_url.split(",");

            return (
              <div
                key={product.product_id}
                className="bg-white rounded-lg shadow-lg overflow-hidden"
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
                    ${product.price}
                  </p>
                  <p className="text-gray-600 mb-4">Stock: {product.stock}</p>
                  <p className="text-gray-600 mb-4">
                    Category: {product.category_name}
                  </p>
                  <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded">
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
