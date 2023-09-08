import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { logoutRoute, refreshTokenRoute } from "./utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionsSuccess } from "./utils/ToastOptions";
import loadingImg from "./assets/loadingImg.gif";
import Navigation from "./pages/Navigation";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SinglePost from "./pages/SinglePost";
import EditPost from "./pages/EditPost";
import AllUsers from "./pages/AllUsers";
import SingleUser from "./components/SingleUser";
import axios from "axios";

export const UserContext = React.createContext([]);

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const userIdFromToken = user?.accessToken
    ? jwtDecode(user.accessToken).userId
    : null;
  const userRoleFromToken = user?.accessToken
    ? jwtDecode(user.accessToken).role
    : null;

  const handleLogout = async () => {
    const result = await axios.post(
      logoutRoute,
      {},
      {
        withCredentials: true,
      }
    );
    if (result.data.status) {
      toast.success(result.data.msg, toastOptionsSuccess);
      setUser({});
      navigate("/login");
    }
  };

  useEffect(() => {
    async function checkRereshToken() {
      const res = await fetch(refreshTokenRoute, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUser({
        accessToken: data.accessToken,
      });
      setLoading(false);
    }
    checkRereshToken();
  }, []);

  if (loading)
    return (
      <main>
        <div className="loadingImage">
          <img src={loadingImg} alt="loading..." />
        </div>
      </main>
    );
  return (
    <UserContext.Provider
      value={{ user, setUser, userIdFromToken, userRoleFromToken }}
    >
      <div className="App">
        <Navigation handleLogout={handleLogout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/post/:postId" element={<SinglePost />} />
          <Route path="/post/edit/:postId" element={<EditPost />} />
          <Route path="/user">
            <Route index element={<AllUsers />} />
            <Route path=":userId" element={<SingleUser />} />
          </Route>
        </Routes>
        <ToastContainer />
      </div>
    </UserContext.Provider>
  );
}

export default App;
