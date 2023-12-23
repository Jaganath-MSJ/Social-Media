import React, { Suspense, lazy, useEffect, useMemo, useState } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import jwtDecode from "jwt-decode";
import { logoutRoute, refreshTokenRoute } from "./utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionsSuccess } from "./utils/ToastOptions";
import axios from "axios";
import loadingImg from "./assets/loadingImg.gif";
import Navigation from "./pages/Navigation";
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const SinglePost = lazy(() => import("./pages/SinglePost"));
const EditPost = lazy(() => import("./pages/EditPost"));
const AllUsers = lazy(() => import("./pages/AllUsers"));
const SingleUser = lazy(() => import("./pages/SingleUser"));

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

  const userContextValue = useMemo(() => {
    return { user, setUser, userIdFromToken, userRoleFromToken };
  }, [user, userIdFromToken, userRoleFromToken]);

  if (loading)
    return (
      <main className="loadingImage">
        <div>
          <img src={loadingImg} alt="loading..." />
        </div>
      </main>
    );

  return (
    <UserContext.Provider value={userContextValue}>
      <main>
        <Navigation handleLogout={handleLogout} />
        <Routes>
          <Route
            path="/"
            element={
              <Suspense
                fallback={
                  <section className="loadingImage">
                    <div>
                      <img src={loadingImg} alt="loading..." />
                    </div>
                  </section>
                }
              >
                <Home />
              </Suspense>
            }
          />
          <Route
            path="/login"
            element={
              <Suspense
                fallback={
                  <section className="loadingImage">
                    <div>
                      <img src={loadingImg} alt="loading..." />
                    </div>
                  </section>
                }
              >
                <Login />
              </Suspense>
            }
          />
          <Route
            path="/register"
            element={
              <Suspense
                fallback={
                  <section className="loadingImage">
                    <div>
                      <img src={loadingImg} alt="loading..." />
                    </div>
                  </section>
                }
              >
                <Register />
              </Suspense>
            }
          />
          <Route
            path="/post/:postId"
            element={
              <Suspense
                fallback={
                  <section className="loadingImage">
                    <div>
                      <img src={loadingImg} alt="loading..." />
                    </div>
                  </section>
                }
              >
                <SinglePost />
              </Suspense>
            }
          />
          <Route
            path="/post/edit/:postId"
            element={
              <Suspense
                fallback={
                  <section className="loadingImage">
                    <div>
                      <img src={loadingImg} alt="loading..." />
                    </div>
                  </section>
                }
              >
                <EditPost />
              </Suspense>
            }
          />
          <Route path="/user">
            <Route
              index
              element={
                <Suspense
                  fallback={
                    <section className="loadingImage">
                      <div>
                        <img src={loadingImg} alt="loading..." />
                      </div>
                    </section>
                  }
                >
                  <AllUsers />
                </Suspense>
              }
            />
            <Route
              path=":userId"
              element={
                <Suspense
                  fallback={
                    <section className="loadingImage">
                      <div>
                        <img src={loadingImg} alt="loading..." />
                      </div>
                    </section>
                  }
                >
                  <SingleUser />
                </Suspense>
              }
            />
          </Route>
        </Routes>
        <ToastContainer />
      </main>
    </UserContext.Provider>
  );
}

export default App;
