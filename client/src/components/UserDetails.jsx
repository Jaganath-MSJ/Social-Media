import React, { useContext, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import Picker from "emoji-picker-react";
import { useDispatch, useSelector } from "react-redux";
import { GrEmoji } from "react-icons/gr";
import { FaUserEdit } from "react-icons/fa";
import { BiSolidUser } from "react-icons/bi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionsError, toastOptionsSuccess } from "../utils/ToastOptions";
import { formatDate } from "../utils/DateFunction.js";
import { UserContext } from "../App.jsx";
import { getUserInfoById } from "../features/userSlice.js";
import { addPost, getPostError, getPostStatus } from "../features/postSlice.js";

function UserDetails({ onOpen }) {
  const dispatch = useDispatch();
  const { userIdFromToken, user } = useContext(UserContext);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const postStatus = useSelector(getPostStatus);
  const postError = useSelector(getPostError);

  const userInfo = useSelector((state) =>
    getUserInfoById(state, userIdFromToken)
  );

  const handleAddPost = (e) => {
    e.preventDefault();
    if (title.trim() !== "" && content.trim() !== "") {
      try {
        dispatch(
          addPost({
            details: {
              title,
              content,
              autorId: userIdFromToken,
              postedOn: new Date().toISOString(),
            },
            token: user.accessToken,
          })
        );
        setTitle("");
        setContent("");
        if (postStatus === "failed") {
          toast.warning(postError, toastOptionsError);
        } else {
          toast.success("Post created successfully", toastOptionsSuccess);
        }
      } catch (err) {
        toast.error("Please try again", toastOptionsError);
      }
    } else {
      toast.error("Please fill all the fields", toastOptionsError);
    }
  };

  const handleEmojiClick = (emoji) => {
    let des = content;
    des += emoji.emoji;
    setContent(des);
  };

  return (
    <Container>
      {userInfo && (
        <div>
          <div className="userHeader">
            <Link to={`/user/${userInfo.userId}`}>
              <BiSolidUser size="1.5rem" className="userImg" />
              <h2>{userInfo.name}</h2>
            </Link>
            <FaUserEdit size="1.5rem" className="editImg" onClick={onOpen} />
          </div>
          <div className="userDetails">
            <p>{userInfo.role}</p>
            <p>
              {userInfo.bio.substring(0, 200)}{" "}
              {userInfo.bio.length >= 200 ? "..." : ""}
            </p>
            <p>
              <span>Joined On : </span> {formatDate(userInfo.joinedOn)}
            </p>
          </div>
        </div>
      )}
      <div className="createPost">
        <form onSubmit={handleAddPost}>
          <input
            type="text"
            placeholder="Post Title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value.replace(/\s+/g, " "))}
          />
          <textarea
            type="text"
            placeholder="Post Content"
            name="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div>
            <GrEmoji
              className="emojiImg"
              size="2rem"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <Picker
                onEmojiClick={handleEmojiClick}
                height="325px"
                width="250px"
              />
            )}
            <button type="submit">Create Post</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </Container>
  );
}
const Container = styled.aside`
  width: 25rem;
  border: 1px solid var(--border-color);
  border-radius: 0.5rem;
  height: max-content;
  .userHeader {
    margin: 1rem;
    display: flex;
    gap: 1rem;
    justify-content: space-between;
    & > a {
      display: flex;
      gap: 1rem;
      .userImg {
        padding: 0.5rem;
        background-color: var(--background-color2);
        color: white;
        border-radius: 2rem;
      }
      & h2 {
        margin: 0;
      }
    }
    .editImg {
      cursor: pointer;
      transition: color 0.3s;
      &:hover {
        color: var(--background-color2);
      }
    }
  }
  .userDetails {
    margin: 1rem;
    p:first-child {
      font-weight: bold;
    }
    & span {
      font-weight: bold;
    }
  }
  .createPost {
    border: 1px solid var(--border-color);
    border-radius: 0.5rem;
    margin: 0.5rem;
    form {
      margin: 0.5rem;
      display: flex;
      flex-direction: column;
      input,
      textarea {
        margin: 0.3rem 0;
        outline: none;
        border: 1px solid var(--border-color);
        background-color: var(--background-color1);
        padding: 0.5rem;
        height: 1.5rem;
        border-radius: 0.2rem;
        font-size: 15px;
      }
      textarea {
        height: 10rem;
        &::-webkit-scrollbar {
          width: 0.2rem;
          &-thumb {
            background-color: var(--scrollbar-thumb);
            width: 0.1rem;
            border-radius: 1rem;
          }
        }
      }
      & > div {
        display: flex;
        .emojiImg {
          cursor: pointer;
          margin: 0.5rem;
          &:hover {
            color: var(--background-color2);
          }
        }
        .EmojiPickerReact {
          position: absolute;
          top: 10rem;
          left: 5rem;
          box-shadow: 0 5px 10px var(--border-color);
          .epr-body::-webkit-scrollbar {
            width: 5px;
            &-thumb {
              background-color: var(--scrollbar-thumb);
            }
          }
          .epr-search-container {
            input {
              background-color: var(--background-color1);
              border: 1px solid var(--border-color);
            }
          }
        }
        & > button {
          margin: 0.3rem auto;
          width: 8rem;
          height: 2rem;
          font-size: 1.1rem;
          background-color: var(--background-color2);
          border-radius: 1rem;
          outline: none;
          border: none;
          cursor: pointer;
        }
      }
    }
  }
`;

export default UserDetails;
