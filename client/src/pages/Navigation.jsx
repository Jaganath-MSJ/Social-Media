import React, { useContext } from "react";
import styled from "styled-components";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

function Navigation({ handleLogout }) {
  const { user } = useContext(UserContext);
  return (
    <Nav>
      <h2>
        <Link to="/">Social Media</Link>
      </h2>
      <ul>
        <li>
          <Link to="/user">Users</Link>
        </li>
        {user?.accessToken ? (
          <li>
            <button onClick={handleLogout}>Logout</button>
          </li>
        ) : (
          <li>
            <Link to="/login">Login</Link>
          </li>
        )}
      </ul>
    </Nav>
  );
}

const Nav = styled.nav`
  margin: 0;
  display: flex;
  justify-content: space-between;
  background-color: lightgray;
  box-shadow: 0px 2px 10px rgba(0, 0, 0, 0.5);
  padding: 0 2rem;
  & ul {
    display: flex;
    justify-content: space-around;
    align-items: center;
    gap: 2rem;
    & li {
      list-style: none;
      font-size: 1.2rem;
      font-weight: 500;
      transition: 0.3s ease-in-out;
      & > button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 0.3rem 0.7rem;
        border-radius: 0.5rem;
        background-color: var(--background-color2);
        border: none;
        cursor: pointer;
        color: white;
        font-weight: 400;
        font-size: 1rem;
        transition: 0.3s ease-in-out;
        &:hover {
          box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.5);
        }
      }
    }
  }
  & a:hover {
    color: var(--background-color2);
  }
`;

Navigation.propTypes = {
  handleLogout: PropTypes.func,
};

export default Navigation;
