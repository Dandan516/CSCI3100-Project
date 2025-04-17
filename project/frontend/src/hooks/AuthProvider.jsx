import { useContext, createContext, useState, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import axios from "axios";

const AuthContext = createContext();

const AuthProvider = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [token, setToken] = useState(localStorage.getItem("site") || "");

  const [isLoading, setIsLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [loginError, setLoginError] = useState(false);

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

    axios
      .post(`${import.meta.env.VITE_API_URL}login/`, data)
      .then((response) => {
        if (response.status === 200) {
          setLoginError(false);
          setLoginSuccess(true);
          setToken(response.data.token);
          getUserInfo();
          localStorage.setItem("site", response.data.token);
          if (!user.username) {    // user is new
            navigate("/start");
          } else {
            navigate("/dashboard");
          }
        }
      })
      .catch((err) => {
        console.error("Login error:", err);
        setLoginError(true);
      });
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
    <AuthContext.Provider value={{ token, user, isLoading, loginSuccess, loginError, getUserInfo, login, logout }}>
      <Outlet />
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};