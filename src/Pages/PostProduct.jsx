import React, { useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";
import * as tf from "@tensorflow/tfjs";
import { Auth } from "../Context/Auth";

// Define class labels for the prediction
const classNames = [
  "BABY PRODUCTS",
  "BEAUTY HEALTH",
  "CLOTHING ACCESSORIES JEWELLERY",
  "ELECTRONICS",
  "GROCERY",
  "HOBBY ARTS AND STATIONARY",
  "HOME KITCHEN TOOLS",
  "PET SUPPLIES",
  "SPORTS OUTDOOR",
];

const PostProduct = () => {
  const {
    product,
    previewImages,
    handleInputChange,
    handleImageChange,
    handleSubmit,
    isuploading,
  } = useContext(Auth);

  const [model, setModel] = useState(null);
  const [predictedCategory, setPredictedCategory] = useState("");

  // Load the model when the component mounts
  useEffect(() => {
    const loadModel = async () => {
      try {
        const loadedModel = await tf.loadLayersModel("Models/json/model.json");
        setModel(loadedModel);
      } catch (error) {
        console.error("Failed to load model:", error);
      }
    };
    loadModel();
  }, []);

  // Function to preprocess the image
  const preprocessImage = (imageElement) => {
    return tf.tidy(() => {
      const tensor = tf.browser
        .fromPixels(imageElement)
        .resizeNearestNeighbor([224, 224])
        .toFloat()
        .div(255.0)
        .expandDims();
      return tensor;
    });
  };

  // Handle image upload and prediction
  const handleImageUploadAndPredict = (event) => {
    handleImageChange(event); // Call existing image change handler

    const file = event.target.files[0]; // Get the first file
    if (file && model) {
      const imageURL = URL.createObjectURL(file);

      // Create an image element to make prediction
      const img = new Image();
      img.src = imageURL;
      img.onload = async () => {
        const processedImage = preprocessImage(img);
        const predictions = await model.predict(processedImage).data();
        const topPrediction = Array.from(predictions)
          .map((p, i) => ({ probability: p, className: i }))
          .sort((a, b) => b.probability - a.probability)[0];

        const predictedCategory =
          classNames[topPrediction.className] ||
          `Class ${topPrediction.className}`;
        setPredictedCategory(predictedCategory);
        tf.dispose(processedImage);
      };
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-lg w-full">
        <h1 className="text-2xl font-bold text-center mb-6">
          Post a New Product
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={product.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Wireless Earbuds"
              required
            />
          </div>
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Category
              {predictedCategory && (
                <span className="ml-2 text-blue-600 font-medium">
                  (Predicted: {predictedCategory})
                </span>
              )}
            </label>
            <input
              type="text"
              name="category_name"
              value={product.category_name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="e.g., Electronics"
              required
            />
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              name="description"
              value={product.description}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              rows="4"
              placeholder="Describe your product"
              required
            ></textarea>
          </div>

          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Price
              </label>
              <input
                type="number"
                name="price"
                value={product.price}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 99.99"
                min="0"
                required
              />
            </div>
            <div className="w-1/2">
              <label className="block mb-2 text-sm font-medium text-gray-700">
                Stock
              </label>
              <input
                type="number"
                name="stock"
                value={product.stock}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                placeholder="e.g., 50"
                min="0"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-2 text-sm font-medium text-gray-700">
              Upload Images
            </label>
            <input
              type="file"
              multiple
              onChange={handleImageUploadAndPredict} // Update to handle image upload and prediction
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
              accept="image/*"
              required
            />
          </div>

          {/* Image Preview */}
          <div className="grid grid-cols-3 gap-4">
            {previewImages.map((image, index) => (
              <div key={index} className="border rounded-lg overflow-hidden">
                <img
                  src={image}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-24 object-cover"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-300"
          >
            {isuploading ? "Posting your Product..." : "Post Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostProduct;
