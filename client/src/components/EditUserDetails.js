import React, { useContext, useState } from "react";
import styled from "styled-components";
import Picker from "emoji-picker-react";
import { GrEmoji } from "react-icons/gr";
import { useDispatch, useSelector } from "react-redux";
import { UserContext } from "../App";
import {
  getUserError,
  getUserInfoById,
  getUserStatus,
  updateUser,
} from "../features/userSlice";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { toastOptionsError, toastOptionsSuccess } from "../utils/ToastOptions";
import ROLE from "../utils/Role";

function EditUserDetails({ onClose, userId }) {
  const dispatch = useDispatch();
  const { user, userRoleFromToken, userIdFromToken } = useContext(UserContext);
  const userInfo = useSelector((state) => getUserInfoById(state, userId));
  const [name, setName] = useState(userInfo.name);
  const [email, setEmail] = useState(userInfo.email);
  const [bio, setBio] = useState(userInfo.bio);
  const [role, setRole] = useState(userInfo.role);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const userStatus = useSelector(getUserStatus);
  const userError = useSelector(getUserError);

  const handleValidation = () => {
    if (name.trim().length < 3) {
      toast.error("Name must be at least 3 characters", toastOptionsError);
      return false;
    } else if (bio.trim() === "") {
      toast.error("bio is required", toastOptionsError);
      return false;
    } else if (email === "") {
      toast.error("Email is required", toastOptionsError);
      return false;
    }
    return true;
  };

  const handleEditUserDetails = (e) => {
    e.preventDefault();
    if (name !== "" && email !== "" && bio !== "" && role !== "") {
      if (handleValidation) {
        dispatch(
          updateUser({
            details: {
              userId: userInfo.userId,
              name: name.trim(),
              email,
              bio: bio.trim(),
              role,
            },
            token: user.accessToken,
          })
        );
        if (userStatus === "failed") {
          toast.warning(userError, toastOptionsError);
        } else {
          toast.success("User updated successfully", toastOptionsSuccess);
          onClose();
        }
      }
    } else {
      toast.error("Please fill all the fields", toastOptionsError);
    }
  };

  const handleEmojiClick = (emoji) => {
    let des = bio;
    des += emoji.emoji;
    setBio(des);
  };

  return (
    <Container>
      <div className="popup-content">
        <button className="close-btn" onClick={onClose}>
          &times;
        </button>
        <h2>Edit User</h2>
        <form onSubmit={handleEditUserDetails}>
          <input
            type="text"
            name="name"
            placeholder="User Name"
            value={name}
            onChange={(e) => setName(e.target.value.replace(/\s+/g, " "))}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
          />
          {userRoleFromToken === ROLE.ADMIN &&
            userInfo.userId !== userIdFromToken && (
              <select
                name="role"
                placeholder="Role"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                {Object.values(ROLE).map((role) => {
                  return <option>{role}</option>;
                })}
              </select>
            )}
          <textarea
            type="text"
            name="bio"
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value.replace(/\s+/g, " "))}
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
            <button type="submit">Update Details</button>
          </div>
        </form>
      </div>
      <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
  .popup-content {
    background-color: #fff;
    padding: 2rem;
    border-radius: 0.5rem;
    width: 30rem;
    height: max-content;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    position: relative;
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      font-size: 2rem;
      background-color: transparent;
      border: none;
      cursor: pointer;
    }
    & > h2 {
      text-align: center;
      margin: 0;
    }
    & > form {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem 0;
      & > input,
      & > textarea,
      & > select {
        margin: 0.3rem 0;
        outline: none;
        border: 1px solid var(--border-color);
        background-color: var(--background-color1);
        padding: 0.5rem;
        height: 1.5rem;
        border-radius: 0.2rem;
        font-size: 15px;
      }
      & > textarea {
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
      & > select {
        height: 2rem;
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
          top: 3.5rem;
          left: 2rem;
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
          width: 9rem;
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
    @media screen and (max-width: 550px) {
      width: 80%;
    }
  }
`;

export default EditUserDetails;
