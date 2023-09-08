import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { BiSolidUser } from "react-icons/bi";
import { UserContext } from "../App";
import { selectAllUser } from "../features/userSlice";
import SingleUser from "../components/SingleUser";
import { useNavigate } from "react-router-dom";

function AllUsers() {
  const navigate = useNavigate();
  const { userIdFromToken, user } = useContext(UserContext);
  useEffect(() => {
    if (!user.accessToken) {
      navigate("/login");
    }
  }, [user, navigate]);

  const allUsers = useSelector(selectAllUser);
  const [userSelected, setUserSelected] = useState(userIdFromToken);
  const [searchUser, setSearchUser] = useState("");

  return (
    <Container>
      <div className="users">
        <div className="searchUser">
          <input
            type="search"
            placeholder="Serahc User"
            name="searchUser"
            value={searchUser}
            onChange={(e) => setSearchUser(e.target.value.trim())}
          />
        </div>
        <div className="allUsers">
          {searchUser === ""
            ? allUsers.map((user) => {
                return (
                  <div
                    key={user.userId}
                    onClick={() => setUserSelected(user.userId)}
                    className={
                      userSelected === user.userId
                        ? "selectedUser"
                        : user.userId === userIdFromToken
                        ? "currentUser"
                        : ""
                    }
                  >
                    <BiSolidUser size="1.5rem" className="userImg" />
                    <h2>{user.name}</h2>
                  </div>
                );
              })
            : allUsers
                .filter((user) =>
                  user.name.toLowerCase().includes(searchUser.toLowerCase())
                )
                .map((user) => {
                  return (
                    <div
                      key={user.userId}
                      onClick={() => setUserSelected(user.userId)}
                      className={
                        userSelected === user.userId
                          ? "selectedUser"
                          : user.userId === userIdFromToken
                          ? "currentUser"
                          : ""
                      }
                    >
                      <BiSolidUser size="1.5rem" className="userImg" />
                      <h2>{user.name}</h2>
                    </div>
                  );
                })}
        </div>
      </div>
      {user.accessToken && <SingleUser userId={userSelected} />}
    </Container>
  );
}

const Container = styled.section`
  display: grid;
  grid-template-columns: 26% 74%;
  gap: 1rem;
  margin: 1rem;
  .users {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    .searchUser {
      margin-right: 1.7rem;
      & > input {
        width: 100%;
        border: 1px solid var(--border-color);
        background-color: var(--background-color1);
        border-radius: 0.5rem;
        padding: 0.5rem 0.7rem;
        outline: none;
      }
    }
    .allUsers {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 0.2rem;
      overflow: auto;
      & > div {
        display: flex;
        border: 1px solid var(--border-color);
        border-radius: 2rem;
        padding: 0.3rem 0.5rem;
        gap: 1rem;
        transition: 0.3s ease-in-out;
        cursor: pointer;
        .userImg {
          padding: 0.5rem;
          background-color: var(--background-color2);
          color: white;
          border-radius: 2rem;
        }
        & > h2 {
          margin: 0;
        }
      }
      .selectedUser {
        background-color: var(--background-color1);
        transform: scale(1.02);
      }
      .currentUser {
        background-color: var(--background-color3);
        color: white;
      }
      &::-webkit-scrollbar {
        width: 0.4rem;
        &-thumb {
          background-color: var(--scrollbar-thumb);
          width: 0.3rem;
          border-radius: 1rem;
        }
      }
    }
  }
  & > section {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    height: 81vh;
  }
  @media screen and (max-width: 950px) {
    grid-template-columns: 45% 55%;
  }
  @media screen and (max-width: 700px) {
    grid-template-columns: 1fr;
    .users {
      height: 30rem;
      .allUsers {
        padding: 0.34rem;
      }
    }
  }
`;

export default AllUsers;
