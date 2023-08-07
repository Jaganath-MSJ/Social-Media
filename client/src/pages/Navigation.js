import React, { useContext } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Logout from "../components/Logout";
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
        <li>
          <Link to="/register">Register</Link>
        </li>
        {user?.accessToken ? (
          <li>
            <Logout handleLogout={handleLogout} />
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
    gap: 2rem;
    & li {
      list-style: none;
      font-size: 1.2rem;
      font-weight: 500;
      transition: 0.3s ease-in-out;
    }
  }
  & a:hover {
    color: var(--background-color2);
  }
`;

export default Navigation;
