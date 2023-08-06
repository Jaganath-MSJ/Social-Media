import React from "react";
import styled from "styled-components";

function Logout({ handleLogout }) {
  return <Button onClick={handleLogout}>Logout</Button>;
}

const Button = styled.button`
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
`;

export default Logout;
