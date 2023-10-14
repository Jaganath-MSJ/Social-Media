import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import UserDetails from "../components/UserDetails";
import AllPosts from "../components/AllPosts";
import EditUserDetails from "../components/EditUserDetails";

function Home() {
  const navigate = useNavigate();
  const { user, userIdFromToken } = useContext(UserContext);
  const [showEditUser, setShowEditUser] = useState(false);

  useEffect(() => {
    if (!user.accessToken) {
      navigate("/login");
    }
  }, [user, navigate]);

  const toogleEditUser = () => {
    setShowEditUser(!showEditUser);
  };

  return (
    <Container>
      <UserDetails onOpen={toogleEditUser} />
      <AllPosts />
      {showEditUser && (
        <EditUserDetails onClose={toogleEditUser} userId={userIdFromToken} />
      )}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  gap: 1rem;
  margin: 1rem;
  @media screen and (max-width: 700px) {
    flex-direction: column;
    & > aside {
      width: 100%;
    }
    & > section {
      flex: none;
    }
  }
`;

export default Home;
