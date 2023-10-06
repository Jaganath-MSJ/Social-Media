import React, { useContext, useState } from "react";
import styled from "styled-components";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BiSolidUser } from "react-icons/bi";
import { FcDownRight } from "react-icons/fc";
import { FaUserEdit, FaUserSlash } from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionsError, toastOptionsSuccess } from "../utils/ToastOptions";
import { calculateTimeAgo, formatDate } from "../utils/DateFunction";
import {
  getPostError,
  getPostStatus,
  selectUserLikesByUserId,
  selectUserPostByUserId,
  selectUserRepliesByUserId,
} from "../features/postSlice";
import { deactivateUser, getUserInfoById } from "../features/userSlice";
import Post from "../components/Post";
import EditUserDetails from "../components/EditUserDetails";
import { UserContext } from "../App";
import ROLE from "../utils/Role";

function SingleUser({ userId }) {
  const [showEditUser, setShowEditUser] = useState(false);
  const { userIdFromToken, user, userRoleFromToken } = useContext(UserContext);
  const userParams = useParams();
  const userInfo = useSelector((state) =>
    getUserInfoById(state, userId ? userId : userParams.userId)
  );
  const dispatch = useDispatch();
  const [selectedNav, setSelectedNav] = useState("posts");
  const userPost = useSelector((state) =>
    selectUserPostByUserId(state, userInfo.userId)
  );
  const userLike = useSelector((state) =>
    selectUserLikesByUserId(state, userInfo.userId)
  );
  const userReplies = useSelector((state) =>
    selectUserRepliesByUserId(state, userInfo.userId)
  );

  const userStatus = useSelector(getPostStatus);
  const userError = useSelector(getPostError);

  let post = null;
  if (selectedNav === "posts") post = userPost;
  else if (selectedNav === "replies") post = userReplies;
  else if (selectedNav === "likes") post = userLike;

  const handleSelectedNav = (e) => {
    setSelectedNav(e.target.name);
  };

  const toogleEditUser = () => {
    setShowEditUser(!showEditUser);
  };

  const handleDeactivateUser = (e) => {
    e.preventDefault();
    if (
      window.confirm(
        `Are you sure you want to ${
          userInfo.isDeactivated ? "reactivate" : "deactivate"
        } this user?`
      )
    ) {
      dispatch(
        deactivateUser({
          details: { userId: userInfo.userId, deactivatedBy: userIdFromToken },
          token: user.accessToken,
        })
      );
      if (userStatus === "failed") {
        toast.warning(userError, toastOptionsError);
      } else if (!userInfo.isDeactivated) {
        toast.success("User deactivated successfully", toastOptionsSuccess);
      } else {
        toast.success("User activated successfully", toastOptionsSuccess);
      }
    }
  };

  return (
    <Container>
      <div className="userDetails">
        <div className="userHeader">
          <BiSolidUser size="2rem" className="userImg" />
          <h1>{userInfo.name}</h1>
          {(userInfo.userId === userIdFromToken ||
            userRoleFromToken === ROLE.ADMIN) && (
            <FaUserEdit
              size="2rem"
              className="editImg"
              onClick={toogleEditUser}
            />
          )}
          {((userInfo.userId === userIdFromToken && !userInfo.isDeactivated) ||
            userRoleFromToken === ROLE.ADMIN ||
            (userInfo.isDeactivated &&
              userInfo.userId === userInfo.deactivatedBy)) && (
            <FaUserSlash
              size="2rem"
              className="deleteImg"
              onClick={handleDeactivateUser}
            />
          )}
          {userInfo.isDeactivated && (
            <h3>
              {userInfo.deactivatedBy === userInfo.userId
                ? "Activate this account to view details"
                : `User is deactivated by Admin`}
            </h3>
          )}
        </div>
        <div className="userDes">
          <h3>{userInfo.role}</h3>
          <p>{userInfo.bio}</p>
          <p>
            <span>MailId : </span>{" "}
            <a href={`mailto:${userInfo.email}`} className="mailTo">
              {userInfo.email}
            </a>
          </p>
          <p>
            <span>Joined Date : </span> {formatDate(userInfo.joinedOn)}
          </p>
        </div>
      </div>
      <div className="otherDetails">
        <nav className="buttons">
          <button
            name="posts"
            onClick={handleSelectedNav}
            className={selectedNav === "posts" ? "selectedNav" : ""}
          >
            Posts
          </button>
          <button
            name="replies"
            onClick={handleSelectedNav}
            className={selectedNav === "replies" ? "selectedNav" : ""}
          >
            Replies
          </button>
          <button
            name="likes"
            onClick={handleSelectedNav}
            className={selectedNav === "likes" ? "selectedNav" : ""}
          >
            Likes
          </button>
        </nav>
        <div className="selected">
          {post.map((post) => {
            return (
              <div key={post.postId}>
                <Post post={post} key={post.postId} />
                {selectedNav === "replies" &&
                  post.comments.map((comment, index) => {
                    return (
                      <div className="comment" key={index}>
                        <FcDownRight size="2rem" />
                        <article>
                          <div>
                            <h4>{userInfo.name}</h4>
                            <p>{calculateTimeAgo(comment.createdOn)}</p>
                          </div>
                          <p>{comment.comment}</p>
                        </article>
                      </div>
                    );
                  })}
              </div>
            );
          })}
          {post.length === 0 && (
            <p className="notAvaiable">No {selectedNav} is avaiable</p>
          )}
        </div>
      </div>
      {showEditUser && (
        <EditUserDetails onClose={toogleEditUser} userId={userInfo.userId} />
      )}
      <ToastContainer />
    </Container>
  );
}

const Container = styled.section`
  margin-right: 1rem;
  padding: 1rem;
  overflow: auto;
  height: 85vh;
  .userDetails {
    .userHeader {
      display: flex;
      gap: 1rem;
      .userImg {
        padding: 0.5rem;
        background-color: var(--background-color2);
        color: white;
        border-radius: 2rem;
      }
      & > h1 {
        margin: 0;
        font-size: 2rem;
      }
      .editImg {
        cursor: pointer;
        transition: color 0.3s;
        &:hover {
          color: var(--background-color2);
        }
      }
      .deleteImg {
        cursor: pointer;
        color: red;
      }
      & > h3 {
        margin: 0;
      }
    }
    .userDes {
      & span {
        font-weight: bold;
      }
      .mailTo:hover {
        color: var(--background-color3);
      }
    }
  }
  .otherDetails {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    display: flex;
    flex-direction: column;
    .buttons {
      padding: 1rem 0;
      background-color: rgba(225, 225, 225);
      box-shadow: 0px 2px 8px -2px rgba(0, 0, 0, 0.5);
      border-radius: 0.5rem;
      position: sticky;
      top: -1.2rem;
      z-index: 1;
      display: flex;
      justify-content: space-around;
      & > button {
        border: none;
        background-color: var(--background-color2);
        border-radius: 1rem;
        padding: 0.5rem 1rem;
        font-size: 1rem;
        cursor: pointer;
      }
      .selectedNav {
        background-color: var(--background-color3);
      }
    }
    .selected {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      & > div {
        display: flex;
        gap: 0.5rem;
        flex-direction: column;
        .comment {
          margin-left: 2rem;
          display: flex;
          gap: 1rem;
          svg {
            margin-top: 0.4rem;
          }
          & > article {
            border: 1px solid var(--border-color);
            border-radius: 0.5rem;
            padding: 0.5rem;
            width: 60%;
            & h4,
            p {
              margin: 0;
            }
            & > div {
              display: flex;
              & > p {
                margin-left: 0.5rem;
              }
            }
          }
        }
      }
      .notAvaiable {
        text-align: center;
      }
    }
  }
  &::-webkit-scrollbar {
    width: 0.4rem;
    &-thumb {
      background-color: var(--scrollbar-thumb);
      width: 0.3rem;
      border-radius: 1rem;
    }
  }
`;

export default SingleUser;
