import { useContext, createContext, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import axios from "axios";

const AuthContext = createContext();

const AuthProvider = () => {
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("site") || "");
  const navigate = useNavigate();

  const getUserInfo = async () => {
    if (token) {
      axios
        .get(`${import.meta.env.VITE_API_URL}userinfo/`, {
          headers: { Authorization: `Token ${token}` },
        })
        .then((response) => {
          setUser(response.data[0]);
        })
        .catch((err) => {
          console.error("Error fetching user info:", err);
          logout(); // Log out if token is invalid
        });
    }
  }

  const login = async (data) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}login/`, data);
      if (response.data) {
        setUser(response.data.user);
        setToken(response.data.token);
        localStorage.setItem("site", response.data.token);
        navigate("/home");
        return true;
      }
      throw new Error(response.data.message);
    } catch (err) {
      console.error("Login error:", err);
      return false;
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
  }, [token]);

  return (
    <AuthContext.Provider value={{ token, user, getUserInfo, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};