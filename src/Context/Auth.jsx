import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [seller, setSeller] = useState(null);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [registrationError, setRegistrationError] = useState(null);

  const updateRegisterInfo = useCallback((info) => {
    setRegisterInfo(info);
  });

  const register = useCallback(
    async (e) => {
      e.preventDefault();
      setIsRegisterLoading(true);
      setRegistrationError(null);

      try {
        const response = await axios.post(
          "http://localhost:3030/api/auth/register",
          registerInfo
        );

        setIsRegisterLoading(false);

        if (response.data.error) {
          toast.error(response.data.error);
          return setRegistrationError(response.data.error);
        }

        toast.success(response.data.message);
        localStorage.setItem("User", JSON.stringify(response.data));
        setUser(response.data);
        navigate("/");
      } catch (error) {
        setIsRegisterLoading(false);
        toast.error("Registration failed!");
        setRegistrationError("Registration failed!");
      }
    },
    [registerInfo, navigate]
  );

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("User");
    const storedSeller = localStorage.getItem("Seller");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    if (storedSeller) {
      setSeller(JSON.parse(storedSeller)); // Ensure parsing and setting is done correctly
    }
  }, []);

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState(null);

  const updateLoginInfo = useCallback((info) => {
    setLoginInfo(info);
  });

  const login = useCallback(
    async (e) => {
      e.preventDefault();

      setIsLoginLoading(true);
      setLoginError(null);

      try {
        const response = await axios.post(
          "http://localhost:3030/api/auth/login",
          loginInfo
        );

        setIsLoginLoading(false);

        if (response.data.error) {
          toast.error(response.data.error);
          setLoginError(response.data.error);
          return;
        }

        toast.success("Successfully Logged In");

        localStorage.setItem("User", JSON.stringify(response.data));
        setUser(response.data);

        // Set seller info if available
        if (response.data.seller) {
          localStorage.setItem("Seller", JSON.stringify(response.data.seller));
          setSeller(response.data.seller);
        } else {
          localStorage.removeItem("Seller");
          setSeller(null);
        }

        navigate("/");
      } catch (error) {
        setIsLoginLoading(false);
        toast.error("An error occurred. Please try again.");
        console.error("Login error:", error);
      }
    },
    [loginInfo, navigate]
  );

  const logout = useCallback(async () => {
    localStorage.removeItem("User");
    localStorage.removeItem("Seller");
    setUser(null);
    setSeller(null);
    toast.success("Logged Out Successfully");
    navigate("/"); // Redirect to home page or login page
  }, [navigate]);

  const [sellerInfo, setSellerInfo] = useState({
    store_name: "",
    store_description: "",
    contact_info: "",
  });

  const updateSellerInfo = useCallback((info) => {
    setSellerInfo(info);
  });

  const [sellerLoading, setSellerLoading] = useState(false);

  const registerSeller = useCallback(
    async (e) => {
      e.preventDefault();

      setSellerLoading(true);
      try {
        const response = await axios.post(
          "http://localhost:3030/api/seller/become-a-seller",
          sellerInfo,
          {
            headers: { Authorization: `Bearer ${user.token}` },
          }
        );
        setSellerLoading(false);
        toast.success(response.data.message);
        localStorage.setItem("Seller", JSON.stringify(response.data));
        setSeller(response.data.seller); // Update seller state
        navigate("/dashboard");
      } catch (error) {
        setSellerLoading(false);
        toast.error(
          error.response?.data.message || "An unknown error occurred."
        );
      }
    },
    [sellerInfo, user, navigate]
  );

  return (
    <Auth.Provider
      value={{
        user,
        registerInfo,
        updateRegisterInfo,
        register,
        isRegisterLoading,
        loginInfo,
        updateLoginInfo,
        isLoginLoading,
        login,
        logout,
        updateSellerInfo,
        sellerInfo,
        registerSeller,
        setSellerLoading,
        seller,
      }}
    >
      {children}
    </Auth.Provider>
  );
};
