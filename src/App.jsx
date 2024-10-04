import React, { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import Footer from "./Components/Footer";
import Header from "./Components/Header";
import TypeWriter from "./Pages/TypeWriter"; // Show this first
import BestSelling from "./Pages/BestSellingPage";

// Lazy load the other pages
const LandingPage = lazy(() => import("./Pages/LandingPage"));
const DashboardPage = lazy(() => import("./Pages/DashboardPage"));
const LoginPage = lazy(() => import("./Pages/LoginPage"));
const RegistrationPage = lazy(() => import("./Pages/RegistrationPage"));
const CartPage = lazy(() => import("./Pages/CartPage"));
const SellerRegistration = lazy(() => import("./Pages/SellerRegistration"));
const ProfilePage = lazy(() => import("./Pages/ProfilePage"));
const PostProduct = lazy(() => import("./Pages/PostProduct"));
const YourProducts = lazy(() => import("./Pages/YourProducts"));

const App = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<TypeWriter />} /> {/* Show this first */}
          {/* Lazy load other routes */}
          <Route
            path="/landing"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LandingPage />
              </Suspense>
            }
          />
          <Route
            path="/dashboard"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <DashboardPage />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <RegistrationPage />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <LoginPage />
              </Suspense>
            }
          />
          <Route
            path="/cart"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <CartPage />
              </Suspense>
            }
          />
          <Route
            path="/bestSelling"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <BestSelling />
              </Suspense>
            }
          />
          <Route
            path="/seller"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <SellerRegistration />
              </Suspense>
            }
          />
          <Route
            path="/profile"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <ProfilePage />
              </Suspense>
            }
          />
          <Route
            path="/post-products"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <PostProduct />
              </Suspense>
            }
          />
          <Route
            path="/yourProducts"
            element={
              <Suspense fallback={<div>Loading...</div>}>
                <YourProducts />
              </Suspense>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
