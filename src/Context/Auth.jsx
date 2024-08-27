import axios from "axios";
import { createContext, useCallback, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const Auth = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registerInfo, setRegisterInfo] = useState({
    name: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const [isRegisterLoading, setIsRegisterLoading] = useState(false);
  const [resgistrationError, setRegistrationError] = useState(null);

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
          // Use response.data instead of response
          toast.error(response.data.error); // Use response.data.error instead of response.error
          return setRegistrationError(response.data.error); // Use response.data.error instead of response
        }

        toast.success(response.data.message); // Use response.data.message instead of response.message
        localStorage.setItem("User", JSON.stringify(response.data)); // Store with consistent key name
        setUser(response.data); // Set user with consistent key name
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
    const storedUser = localStorage.getItem("User"); // Use consistent key name
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      console.log("Stored user:", storedUser); // Log the raw user data
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
      setRegistrationError(null);

      try {
        const response = await axios.post(
          "http://localhost:3030/api/auth/login",
          loginInfo
        );

        setIsLoginLoading(false);

        if (response.data.error) {
          toast.error(response.data.error); // Display error message
          setRegistrationError(response.data.error);
          return;
        }

        toast.success("Successfully Logged In"); // Show success message

        localStorage.setItem("User", JSON.stringify(response.data)); // Save user data
        setUser(response.data); // Update user state
        navigate("/"); // Redirect to home page
      } catch (error) {
        setIsLoginLoading(false);
        toast.error("An error occurred. Please try again."); // Generic error message
        console.error("Login error:", error); // Log error for debugging
      }
    },
    [loginInfo, navigate] // Added navigate to dependencies
  );

  const logout = useCallback(async (e) => {
    localStorage.removeItem("User");
    setUser(null);
    toast.success("Logged Out Successfully");
  });

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
      }}
    >
      {children}
    </Auth.Provider>
  );
};
