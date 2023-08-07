import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionsError, toastOptionsSuccess } from "../utils/ToastOptions";
import { UserContext } from "../App";
import { loginRoute } from "../utils/APIRoutes";
function Login() {
  const navigate = useNavigate();
  const { setUser, user } = useContext(UserContext);
  useEffect(() => {
    if (user.accessToken) {
      navigate("/");
    }
  }, [user, navigate]);

  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();
    if (name !== "" && password !== "") {
      const data = await fetch(loginRoute, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          password,
        }),
      });
      const result = await data.json();
      if (!result.status) {
        toast.error(result.msg, toastOptionsError);
      } else if (result.accessToken) {
        setUser({ accessToken: result.accessToken });
        toast.success(result.msg, toastOptionsSuccess);
        navigate("/");
      } else {
        toast.error("Can't Login. Please try again", toastOptionsError);
      }
    } else {
      toast.error("Please fill all the fields", toastOptionsError);
    }
  };

  const handleChange = (e) => {
    if (e.target.name === "name") {
      setName(e.target.value);
    } else {
      setPassword(e.target.value);
    }
  };

  return (
    <Container>
      <div className="form">
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="field">
            <input
              type="text"
              placeholder="Name"
              name="name"
              value={name}
              onChange={handleChange}
              autoComplete="name"
            />
          </div>
          <div className="field">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={password}
              onChange={handleChange}
              autoComplete="current-password"
            />
          </div>
          <div className="field">
            <button type="submit">Login</button>
          </div>
        </form>
        <div className="form-link">
          <span>
            Don't have an account? <Link to="/register">Register</Link>
          </span>
        </div>
      </div>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.section`
  height: 90vh;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  column-gap: 2rem;
  .form {
    max-width: 26rem;
    width: 100%;
    padding: 2rem;
    padding-top: 1rem;
    border-radius: 1rem;
    background: var(--background-color4);
    h1 {
      font-size: 2rem;
      font-weight: 600;
      text-align: center;
    }
    form {
      margin-top: 2rem;
      .field {
        height: 3.5rem;
        width: 100%;
        margin: 1rem 0;
        border-radius: 1rem;
        input,
        button {
          height: 100%;
          width: 100%;
          border: none;
          font-size: 1rem;
          font-weight: 500;
          border-radius: 0.5rem;
        }
        input {
          width: 97%;
          padding-left: 10px;
          outline: none;
          &:focus {
            border-bottom-width: 2px;
          }
        }
        button {
          color: white;
          background-color: dodgerblue;
          transition: all 0.3s ease;
          font-size: 1.3rem;
          cursor: pointer;
          margin-bottom: 1rem;
          &:hover {
            box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.5);
          }
        }
      }
    }
  }
  .form-link {
    margin-top: 1rem;
    a {
      color: var(--background-color3);
      cursor: pointer;
      &:hover {
        text-decoration: underline;
      }
    }
  }
`;

export default Login;
