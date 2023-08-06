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
  }, [user]);

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
  display: grid;
  grid-template-columns: 30% 70%;
  gap: 1rem;
  margin: 1rem;
  @media screen and (max-width: 900px) {
    grid-template-columns: 45% 55%;
  }
`;

export default Home;
