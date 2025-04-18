import { useContext, createContext, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import axios from "axios";

const AuthContext = createContext();

const AuthProvider = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    id: undefined,
    username: "",
    email: "",
    first_name: "",
    last_name: "",
    birthday: undefined,
    date_joined: undefined,
    last_login: undefined,
  });
  const [token, setToken] = useState(localStorage.getItem("site") || "");

  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

  const getUserInfo = async () => {
    const storedToken = localStorage.getItem("site");
    if (storedToken) {
      setToken(storedToken); // Update the token state
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}userinfo/`, {
          headers: { Authorization: `Token ${storedToken}` }, // Use the token from localStorage
        });
        const userData = response.data[0];
        setUser(userData); // Update the user state
        return userData; // Return the fetched user data
      } catch (error) {
        console.error("Error fetching user info:", error);
        logout(); // Log out if the token is invalid
      }
    } else {
      logout(); // Log out if no token is present
    }
    return null; // Return null if no token or an error occurs
  };

  const login = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}login/`, data);
      if (response.status === 200) {
        setLoginError(false);
        setLoginSuccess(true);
        setToken(response.data.token);
        localStorage.setItem("site", response.data.token);

        // Get user info directly
        const userInfo = await getUserInfo();
        const isNewUser = !userInfo.username;
        if (isNewUser) {
          navigate("/start");
        } else {
          navigate("/dashboard");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(true);
    }
  };

  const logout = () => {
    setUser(null);
    setToken("");
    localStorage.removeItem("site");
    navigate("/login");
  };

  useEffect(() => {
    getUserInfo();
    setIsLoading(false);
    setLoginSuccess(false);
    setLoginError(false);
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, isLoading, loginSuccess, loginError, getUserInfo, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};