import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionsError, toastOptionsSuccess } from "../utils/ToastOptions";
import { registerRoute } from "../utils/APIRoutes";

function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleValidation = () => {
    if (name.length < 3) {
      toast.error("Name must be at least 3 characters", toastOptionsError);
      return false;
    } else if (password.length < 8) {
      toast.error("Password must be at least 8 characters", toastOptionsError);
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOptionsError);
      return false;
    }
    return true;
  };

  const handleRegsiter = async (event) => {
    event.preventDefault();
    if (name !== "" && email !== "" && password !== "") {
      if (handleValidation()) {
        const joinedOn = new Date().toISOString();
        const result = await axios.post(registerRoute, {
          name,
          email,
          password,
          joinedOn,
        });
        if (!result.data.status) {
          toast.error(result.data.msg, toastOptionsError);
        } else {
          toast.success(result.data.msg, toastOptionsSuccess);
          navigate("/login");
        }
      }
    } else {
      toast.error("Please fill all the fields", toastOptionsError);
    }
  };
  return (
    <Container>
      <div className="form">
        <h1>Register</h1>
        <form onSubmit={handleRegsiter}>
          <div className="field">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value.trim())}
              autoComplete="name"
            />
          </div>
          <div className="field">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              autoComplete="email"
            />
          </div>
          <div className="field">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value.trim())}
              autoComplete="password"
            />
          </div>
          <div className="field">
            <button type="submit">Register</button>
          </div>
        </form>
        <div className="form-link">
          <span>
            Already have an account? <Link to="/login">Login</Link>
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
          outline: none;
          width: 97%;
          padding-left: 10px;
          &:focus {
            border-bottom-width: 2px;
          }
        }
        button {
          color: white;
          background-color: var(--background-color2);
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

export default Register;
